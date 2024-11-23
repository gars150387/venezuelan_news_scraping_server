const Router = require("express").Router;
const router = Router();
const yt_patricia_poleo = require("../controller/yt_patricia_poleo.js");
const patriciaPoleoController = () =>
  router.post("/patricia_poleo", yt_patricia_poleo);
module.exports = patriciaPoleoController;
