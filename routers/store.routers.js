const express = require("express");
const {Store} = require("../models")
const { getAllStore, createStore, updateStore, updatePositionOfStore, getAllStoreForUser, getDetailStore, createForm } = require("../controllers/store.controllers.js");
const {authenticate} = require("../middlewares/auth/authenticate.js")
const {authorize} = require("../middlewares/auth/authorize.js");
const { checkCreateStore } = require("../middlewares/validates/checkCreate");
const storeRouter = express.Router();

storeRouter.get("/user", getAllStoreForUser);
storeRouter.get("/detail/:id_store", authenticate, authorize(["Admin"]), getDetailStore);
storeRouter.get("/admin", authenticate, authorize(["Admin"]), getAllStore);
storeRouter.get("/createform", authenticate, authorize(["Admin"]), createForm);
storeRouter.post("/create", authenticate, authorize(["Admin"]), checkCreateStore(Store), createStore);
storeRouter.put("/update/:id_store", authenticate, authorize(["Admin"]), checkCreateStore(Store), updateStore);
storeRouter.put("/updateposition", authenticate, authorize(["Quản lý"]), updatePositionOfStore);

module.exports = {
    storeRouter,
}