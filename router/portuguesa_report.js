const Router = require("express").Router;
const portuguesa_reporta = require("../controller/portuguesa_reporta.js");
const router = Router();
const portuguesaReporta = () =>
  router.get("/portuguesa_report", portuguesa_reporta);

module.exports = portuguesaReporta;
