const express = require("express");
const {Type} = require("../models")
const { getAllType, createType, updateType, getDetailType, getAllTypeAdmin, createForm } = require("../controllers/type.controllers.js");
const {authenticate} = require("../middlewares/auth/authenticate.js")
const {authorize} = require("../middlewares/auth/authorize.js");
const { checkCreateType } = require("../middlewares/validates/checkCreate");
const typeRouter = express.Router();

typeRouter.get("/", getAllType);
typeRouter.get("/admin", authenticate, authorize(["Admin"]), getAllTypeAdmin);
typeRouter.get("/createform", authenticate, authorize(["Admin"]), createForm);
typeRouter.get("/detail/:id_type", authenticate, authorize(["Admin"]), getDetailType);
typeRouter.post("/create", authenticate, authorize(["Admin"]), checkCreateType(Type), createType);
typeRouter.put("/update/:id_type", authenticate, authorize(["Admin"]), checkCreateType(Type), updateType);

module.exports = {
    typeRouter,
}