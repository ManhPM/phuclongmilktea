const { Ingredient, Store, Ingredient_store } = require("../models");
const { QueryTypes } = require("sequelize");
const cloudinary = require("cloudinary").v2;    

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}

const createIngredient = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    const ingredient = await Ingredient.create({
      name: req.body.name,
      unit: req.body.unit,
      image: cldRes.url,
    });
    const store = await Store.findAll({});
    let i = 0;
    while (store[i]) {
      await Ingredient_store.create({
        id_ingredient: ingredient.id_ingredient,
        id_store: store[i].id_store,
        quantity: 0,
      });
      i++;
    }
    res
      .status(201)
      .render("ingredient/ingredient-create", {
        message: "Tạo mới thành công!",
        flag: 1,
      });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const updateIngredient = async (req, res) => {
  const { id_ingredient } = req.params;
  const { name, unit } = req.body;
  try {
    const update = await Ingredient.findOne({
      where: {
        id_ingredient,
      },
    });
    if(req.file){
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
      update.image = cldRes.url;
    }
    update.name = name;
    update.unit = unit;
    await update.save();
    const item = await Ingredient.findOne({
      raw: true,
      where: {
        id_ingredient,
      },
    });
    res
      .status(201)
      .render("ingredient/ingredient-create", {
        item,
        message: "Cập nhật thành công!",
        flag: 2,
      });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getAllIngredient = async (req, res) => {
  const { name } = req.query;
  try {
    const perPage = 12;
    const page = req.params.page || 1;
    const staff = await Ingredient.sequelize.query(
      "SELECT S.*, A.id_role FROM staffs as S, accounts as A WHERE A.username = :username AND A.id_account = S.id_account",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    if (staff[0].id_role == 5) {
      const itemList = await Ingredient.sequelize.query(
        "SELECT I.* FROM ingredients as I",
        {
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      const totalItems = await Ingredient.sequelize.query(
        "SELECT COUNT(*) as total FROM ingredients",
        {
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res
        .status(201)
        .render("ingredient/ingredient-admin", {
          total: totalItems[0].total,
          itemList, id_role: req.id_role
        });
    } else {
      const itemList = await Ingredient.sequelize.query(
        "SELECT I.*, SI.quantity FROM ingredients as I, ingredient_stores as SI WHERE I.id_ingredient = SI.id_ingredient AND SI.id_store = :id_store",
        {
          replacements: {
            id_store: staff[0].id_store,
          },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      const totalItems = await Ingredient.sequelize.query(
        "SELECT COUNT(*) as total FROM ingredients",
        {
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res
        .status(201)
        .render("ingredient/ingredient", {
          total: totalItems[0].total,
          itemList, id_role: req.id_role
        });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const processingIngredient = async (req, res) => {
  const { id_ingredient } = req.params;
  const { quantity } = req.body;
  try {
    const staff = await Ingredient.sequelize.query(
      "SELECT S.* FROM staffs as S, accounts as A WHERE A.username = :username AND A.id_account = S.id_account",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const ingredientList = await Ingredient.sequelize.query(
      "SELECT R.id_u_ingredient, R.id_ingredient, IG.unit, IG.name as name_ingredient, IG.image, (R.quantity*(:quantity)) as totalquantity, (SELECT quantity FROM unprocessed_ingredient_stores WHERE id_u_ingredient = R.id_u_ingredient AND id_store = :id_store) as quantity FROM recipe_ingredients as R, unprocessed_ingredients as IG WHERE R.id_ingredient = :id_ingredient AND IG.id_u_ingredient = R.id_u_ingredient",
      {
        replacements: {
          id_ingredient: id_ingredient,
          quantity: quantity,
          id_store: staff[0].id_store,
        },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    let i = 0;
    let isEnough = 1;
    while (ingredientList[i]) {
      if (ingredientList[i].totalquantity >= ingredientList[i].quantity) {
        isEnough = 0;
        break;
      } else {
        i++;
      }
    }
    const item = await Ingredient.findOne({
      raw: true,
      where: {
        id_ingredient,
      },
    });
    if (isEnough == 1) {
      let j = 0;
      while (ingredientList[j]) {
        await Ingredient.sequelize.query(
          "UPDATE unprocessed_ingredient_stores SET quantity = quantity - (:quantity) WHERE id_u_ingredient = :id_u_ingredient AND id_store = :id_store",
          {
            replacements: {
              id_u_ingredient: ingredientList[j].id_u_ingredient,
              quantity: ingredientList[j].totalquantity,
              id_store: staff[0].id_store,
            },
            type: QueryTypes.UPDATE,
            raw: true,
          }
        );
        j++;
      }
      await Ingredient.sequelize.query(
        "UPDATE ingredient_stores SET quantity = quantity + (:quantity) WHERE id_ingredient = :id_ingredient AND id_store = :id_store",
        {
          replacements: {
            quantity: quantity,
            id_ingredient: id_ingredient,
            id_store: staff[0].id_store,
          },
          type: QueryTypes.UPDATE,
          raw: true,
        }
      );
      res
        .status(201)
        .render("ingredient/ingredient-process", {
          item,
          message: "Chế biến thành công!",
        });
    } else {
      res
        .status(401)
        .render("ingredient/ingredient-process", {
          item,
          message: "Số lượng nguyên liệu không đủ!",
        });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getDetailIngredient = async (req, res) => {
  const { id_ingredient, flag } = req.params;
  try {
    const item = await Ingredient.findOne({
      raw: true,
      where: {
        id_ingredient,
      },
    });
    if (flag == "update") {
      res.status(200).render("ingredient/ingredient-create", { item, flag: 2 });
    } else {
      res.status(200).render("ingredient/ingredient-process", { item });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const createForm = async (req, res) => {
  try {
    res.status(200).render("ingredient/ingredient-create", { flag: 1 });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

module.exports = {
  getAllIngredient,
  getDetailIngredient,
  processingIngredient,
  createIngredient,
  updateIngredient,
  createForm,
};
