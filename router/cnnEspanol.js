const Router = require("express").Router;
const router = Router();
const cnnespanol = require("../controller/cnnespanol.js");
const cnnEspanol = () => router.get("/cnn_espanol", cnnespanol);
module.exports = cnnEspanol;
