const Router = require("express").Router;
const router = Router();
const elNacional = require("../controller/elnacional.js");
const elNacionalController = () => router.get("/el_nacional", elNacional);
module.exports = elNacionalController;
