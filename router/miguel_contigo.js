const Router = require("express").Router;
const router = Router();
const yt_miguel_contigo = require("../controller/yt_miguel_contigo.js");
const miguelContogController = () =>
  router.get("/miguel_contigo", yt_miguel_contigo);
module.exports = miguelContogController;
