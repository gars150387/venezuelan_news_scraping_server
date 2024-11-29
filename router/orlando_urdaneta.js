const Router = require("express").Router;
const router = Router();
const yt_orlando_urdaneta = require("../controller/yt_orlando_urdaneta.js");
const orlandoUrdanetaController = () =>
  router.get("/orlando_urdaneta", yt_orlando_urdaneta);
module.exports = orlandoUrdanetaController;