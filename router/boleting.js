const Router = require("express").Router;
const router = Router();
const boletin = require("../controller/boletin.js");
const boletinController = () => router.get("/boletin", boletin);
module.exports = boletinController;