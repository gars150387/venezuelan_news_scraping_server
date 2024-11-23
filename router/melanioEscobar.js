const Router = require("express").Router;
const router = Router();
const yt_melanio_escobar = require("../controller/yt_melanio_escobar.js");
const melanioEscobarController = () =>
  router.post("/melanio_escobar", yt_melanio_escobar);
module.exports = melanioEscobarController;
