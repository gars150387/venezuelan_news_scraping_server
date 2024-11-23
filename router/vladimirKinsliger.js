const Router = require("express").Router;
const router = Router();
const yt_vladimir_kinsliger = require("../controller/yt_vladimir_kinsliger.js");
const vladimirKinsligerController = () =>
  router.post("/vladimir_kinsliger", yt_vladimir_kinsliger);
module.exports = vladimirKinsligerController;