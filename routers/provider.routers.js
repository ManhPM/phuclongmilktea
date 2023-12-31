const express = require("express");
const {Provider} = require("../models")
const { getAllProvider, createProvider, updateProvider, getDetailProvider, createForm } = require("../controllers/provider.controllers.js");
const {authenticate} = require("../middlewares/auth/authenticate.js")
const {authorize} = require("../middlewares/auth/authorize.js");
const { checkCreateProvider } = require("../middlewares/validates/checkCreate");
const providerRouter = express.Router();

providerRouter.get("/", authenticate, authorize(["Admin"]), getAllProvider);
providerRouter.get("/detail/:id_provider", authenticate, authorize(["Admin"]), getDetailProvider);
providerRouter.get("/createform", authenticate, authorize(["Admin"]), createForm);
providerRouter.post("/create", authenticate, authorize(["Admin"]), checkCreateProvider(Provider), createProvider);
providerRouter.put("/update/:id_provider", authenticate, authorize(["Admin"]), checkCreateProvider(Provider), updateProvider);



module.exports = {
    providerRouter,
}