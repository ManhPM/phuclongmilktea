const {
  Shipper,
  Customer,
  Staff,
  Discount,
  Import_invoice_detail,
  Export_invoice_detail,
  Recipe,
  Recipe_ingredient
} = require("../../models");
const { QueryTypes } = require("sequelize");

const checkCreateAccount = (Model) => {
  return async (req, res, next) => {
    const { username } = req.body;
    const item = await Model.findOne({
      raw: true,
      where: {
        username,
      },
    });
    if (!item) {
      next();
    } else {
      res.status(400).render("account/signup",{item, message: "Tài khoản đã tồn tại!"});
    }
  };
};

const checkCreateItem = (Model) => {
  return async (req, res, next) => {
    const { name, price, id_type } = req.body;
    const item = await Model.findOne({
      raw: true,
      where: {
        name,
        price,
        id_type,
      },
    });
    if(!item){
      next();
    }
    else{
      if(!req.params.id_item){
        res.status(400).render("item/item-create",{item, message: "Sản phẩm đã tồn tại!", flag: 1});
      }
      else{
        res.status(400).render("item/item-create",{item, message: "Sản phẩm đã tồn tại!", flag: 2});
      }
    }
  };
};

const checkCreateType = (Model) => {
  return async (req, res, next) => {
    const { name } = req.body;
    const item = await Model.findOne({
      raw: true,
      where: {
        name,
      },
    });
    if (!item) {
      next();
    } else {
      if(!req.params.id_type){
        res.status(400).render("type/type-create",{item, message: "Loại hàng đã tồn tại!", flag: 1});
      }
      else{
        res.status(400).render("type/type-create",{item, message: "Loại hàng đã tồn tại!", flag: 2});
      }
    }
  };
};

const checkCreateReview = (Model) => {
  return async (req, res, next) => {
    const { id_order } = req.query;
    const order = await Model.findOne({
      where: {
        id_order,
      },
    });
    if (order.status == 1) {
      next();
    } else {
      res
        .status(400)
        .json({
          message:
            "Đơn hàng đã bị huỷ hoặc chưa được xác nhận. Không thể đánh giá!",
        });
    }
  };
};

const checkCreateProvider = (Model) => {
  return async (req, res, next) => {
    const { name, phone } = req.body;
    const item = await Model.findOne({
      raw: true,
      where: {
        name,
        phone,
      },
    });
    if (!item) {
      next();
    } else {
      if(!req.params.id_provider){
        res.status(400).render("provider/provider-create",{item, message: "Nhà cung cấp đã tồn tại!", flag: 1});
      }
      else{
        res.status(400).render("provider/provider-create",{item, message: "Nhà cung cấp đã tồn tại!", flag: 2});
      }
    }
  };
};
const checkCreateStore = (Model) => {
  return async (req, res, next) => {
    const { name, phone, address } = req.body;
    const item = await Model.findOne({
      raw: true,
      where: {
        name,
        address,
        phone,
      },
    });
    if (!item) {
      next();
    } else {
      if(!req.params.id_store){
        res.status(400).render("store/store-create",{item, message: "Cửa hàng đã tồn tại!", flag: 1});
      }
      else{
        res.status(400).render("store/store-create",{item, message: "Cửa hàng đã tồn tại!", flag: 2});
      }
    }
  };
};
const checkCreatePayment = (Model) => {
  return async (req, res, next) => {
    const { name } = req.body;
    const item = await Model.findOne({
      raw: true,
      where: {
        name,
      },
    });
    if (!item) {
      next();
    } else {
      if(!req.params.id_payment){
        res.status(400).render("payment/payment-create",{item, message: "Phương thức thanh toán đã tồn tại!", flag: 1});
      }
      else{
        res.status(400).render("payment/payment-create",{item, message: "Phương thức thanh toán đã tồn tại!", flag: 2});
      }
    }
  };
};
const checkCreateUnprocessedIngredient = (Model) => {
  return async (req, res, next) => {
    const { name } = req.body;
    const item = await Model.findOne({
      raw: true,
      where: {
        name,
      },
    });
    if (!item) {
      next();
    } else {
      if(!req.params.id_u_ingredient){
        res.status(400).render("unprocessed-ingredient/unprocessed-ingredient-create",{item, message: "Nguyên liệu thô đã tồn tại!", flag: 1});
      }
      else{
        res.status(400).render("unprocessed-ingredient/unprocessed-ingredient-create",{item, message: "Nguyên liệu thô đã tồn tại!", flag: 2});
      }
    }
  };
};
const checkCreateIngredient = (Model) => {
  return async (req, res, next) => {
    const { name } = req.body;
    const item = await Model.findOne({
      raw: true,
      where: {
        name,
      },
    });
    if (!item) {
      next();
    } else {
      if(!req.params.id_ingredient){
        res.status(400).render("ingredient/ingredient-create",{item, message: "Nguyên liệu đã tồn tại!", flag: 1});
      }
      else{
        res.status(400).render("ingredient/ingredient-create",{item, message: "Nguyên liệu đã tồn tại!", flag: 2});
      }
    }
  };
};

const checkItemValue = (Model) => {
  return async (req, res, next) => {
    const { price, name } = req.body;
    
    if (price > 0) {
      next();
    } else {
      const item = await Model.findOne({
        where: {
          name,
        },
      });
      if(!req.params.id_item){
        res.status(400).render("item/item-create",{item, message: "Số lượng sản phẩm phải lớn hơn 0!", flag: 1});
      }
      else{
        res.status(400).render("item/item-create",{item, message: "Số lượng sản phẩm phải lớn hơn 0!", flag: 2});
      }
    }
  };
};

const checkCreateEmail = async (req, res, next) => {
  const { email } = req.body
  try {
    const customer = await Customer.findOne({
      where: {
        email,
      },
    });
    const shipper = await Shipper.findOne({
      where: {
        email,
      },
    });
    const staff = await Staff.findOne({
      where: {
        email,
      },
    });
    if(customer || shipper || staff){
      if(customer){
        res.status(400).json({ message: "Email đã tồn tại!"});
      }
      if(shipper){
        res.status(400).json({ message: "Email đã tồn tại!"});
      }
      if(staff){
        res.status(400).render("staff/staff-create",{ message: "Email đã tồn tại!"});
      }
    }
    else {
      next();
    }
  } catch (error) {
    res.status(500).json({ message: "Middleware Error!" });
  }
}

const checkCreateDiscount = async (req, res, next) => {
  const { code } = req.body
  try {
    const item = await Discount.findOne({
      raw: true,
      where: {
        code,
      },
    });
    if(item){
      if(!req.params.code){
        res.status(400).render("discount/discount-create",{item, message: "Mã giảm giá đã tồn tại!", flag: 1});
      }
      else{
        res.status(400).render("discount/discount-create",{item, message: "Mã giảm giá đã tồn tại!", flag: 2});
      }
    }
    else {
      next();
    }
  } catch (error) {
    res.status(500).json({ message: "Middleware Error!" });
  }
}


const checkPhoneCheckout = async (req, res, next) => {
  try {
    const info = await Customer.sequelize.query(
      "SELECT C.*, CU.phone FROM carts as C, customers as CU, accounts as A WHERE A.username = :username AND CU.id_account = A.id_account AND CU.id_customer = C.id_customer",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    if(info[0].phone){
      next();
    }
    else {
      res.status(400).json({ message: "Vui lòng cập nhật số điện thoại trước khi đặt hàng!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Middleware Error!" });
  }
}

const checkDiscountCode = async (req, res, next) => {
  const {code} = req.body
  try {
    if(code){
      const discount = await Discount.findOne({
        where: {
          code,
        },
      });
      if(discount.quantity > 0){
        const date = new Date();
        date.setHours(date.getHours() + 7);
        if(discount.end_date >= date){
          next();
        }
        else {
          res.status(400).json({ message: "Mã xác nhận đã hết hạn sử dụng!" });
        }
      }
      else {
        res.status(400).json({ message: "Mã xác nhận đã hết lượt sử dụng!"});
      }
    }
    else {
      next();
    }
  } catch (error) {
    res.status(500).json({ message: "Middleware Error!" });
  }
}

const checkCreateRecipeItem = async (req, res, next) => {
  const {id_ingredient} = req.body
  const {id_item} = req.params
  try {
      const item = await Recipe.findOne({
        where: {
          id_item,
          id_ingredient
        },
      });
      if(item){
        if(req.params.id_item && req.params.id_ingredient){
          res.status(400).render("recipe/recipe-create",{item, message: "Công thức đã tồn tại!", flag: 2});
        }
        else{
          res.status(400).render("recipe/recipe-create",{message: "Công thức đã tồn tại!", flag: 1});
        }
      }
      else {
        next();
      }
  } catch (error) {
    res.status(500).json({ message: "Middleware Error!" });
  }
}

const checkCreateRecipeIngredient = async (req, res, next) => {
  const {id_u_ingredient} = req.body
  const {id_ingredient} = req.params
  try {
      const item = await Recipe_ingredient.findOne({
        where: {
          id_u_ingredient,
          id_ingredient
        },
      });
      if(item){
        if(req.params.id_u_ingredient && req.params.id_ingredient){
          res.status(400).render("recipe/recipe-create",{item, message: "Công thức đã tồn tại!", flag: 2});
        }
        else{
          res.status(400).render("recipe/recipe-create",{ message: "Công thức đã tồn tại!", flag: 1});
        }
      }
      else {
        next();
      }
  } catch (error) {
    res.status(500).json({ message: "Middleware Error!" });
  }
}

const checkCreateShippingPartner = (Model) => {
  return async (req, res, next) => {
    const { name } = req.body;
    const item = await Model.findOne({
      raw: true,
      where: {
        name,
      },
    });
    if (!item) {
      next();
    } else {
      if(req.params.id_shipping_partner){
        res.status(400).render("shipping_partner/shipping_partner-create",{item, message: "Đơn vị vận chuyển đã tồn tại!", flag: 2});
      }
      else{
        res.status(400).render("shipping_partner/shipping_partner-create",{item, message: "Đơn vị vận chuyển đã tồn tại!", flag: 1});
      }
    }
  };
};


const checkUnConfirmedOrder = (Model) => {
  return async (req, res, next) => {
    const info = await Customer.sequelize.query(
      "SELECT C.*, CU.phone FROM carts as C, customers as CU, accounts as A WHERE A.username = :username AND CU.id_account = A.id_account AND CU.id_customer = C.id_customer",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const item = await Model.findOne({
      raw: true,
      where: {
        id_customer: info[0].id_customer,
        status: 0,
      },
    });
    if (!item) {
      next();
    } else {
      res.status(400).json({ message: "Đang có đơn hàng chưa xác nhận, không thể đặt thêm!" });
    }
  };
};

const checkCreateImportInvoiceDetail = async (req, res, next) => {
  const {id_u_ingredient} = req.body
  const {id_i_invoice} = req.params
    try {
      const item = await Import_invoice_detail.sequelize.query(
        "SELECT * FROM import_invoice_details WHERE id_i_invoice = :id_i_invoice AND id_u_ingredient = :id_u_ingredient",
        {
          replacements: { id_i_invoice, id_u_ingredient },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      if (!item[0]) {
        next();
      } else {
        if(req.params.id_u_ingredient && req.params.id_ingredient){
          res.status(400).render("shipping_partner/shipping_partner-create",{item, message: "Đã có sản phẩm này trong hoá đơn!", flag: 2});
        }
        else{
          res.status(400).render("shipping_partner/shipping_partner-create",{item, message: "Đã có sản phẩm này trong hoá đơn!", flag: 1});
        }
      }
    } catch (error) {
      res.status(501).json({ message: "Middleware Error!" });
    }
}

const checkCreateExportInvoiceDetail = async (req, res, next) => {
  const {id_u_ingredient, id_e_invoice} = req.body
    try {
      const item = await Export_invoice_detail.sequelize.query(
        "SELECT * FROM export_invoice_details WHERE id_e_invoice = :id_e_invoice AND id_u_ingredient = :id_u_ingredient",
        {
          replacements: { id_e_invoice, id_u_ingredient },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      if (!item[0]) {
        next();
      } else {
        res.status(400).json({ message: "Đã có sản phẩm này trong hoá đơn!" });
      }
    } catch (error) {
      res.status(501).json({ message: "Middleware Error!" });
    }
}

module.exports = {
  checkCreateAccount,
  checkCreateItem,
  checkItemValue,
  checkCreateReview,
  checkCreateType,
  checkCreateProvider,
  checkCreateStore,
  checkCreatePayment,
  checkCreateUnprocessedIngredient,
  checkCreateIngredient,
  checkCreateEmail,
  checkPhoneCheckout,
  checkDiscountCode,
  checkCreateShippingPartner,
  checkUnConfirmedOrder,
  checkCreateExportInvoiceDetail,
  checkCreateImportInvoiceDetail,
  checkCreateRecipeItem,
  checkCreateRecipeIngredient,
  checkCreateDiscount
};
