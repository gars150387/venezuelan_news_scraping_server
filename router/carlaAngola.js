const Router = require("express").Router;
const router = Router();
const yt_carla_angola = require("../controller/yt_carla_angola.js");
const carlasAngollaController = () =>
  router.get("/carla_angola", yt_carla_angola);
module.exports = carlasAngollaController;
