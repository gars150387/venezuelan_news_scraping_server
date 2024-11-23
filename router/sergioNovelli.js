const Router = require("express").Router;
const router = Router();
const yt_sergio_novelli = require("../controller/yt_sergio_novelli.js");
const sergioNovelliController = () =>
  router.post("/sergio_novelli", yt_sergio_novelli);
module.exports = sergioNovelliController;