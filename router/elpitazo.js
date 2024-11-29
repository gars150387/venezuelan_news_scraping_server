const Router = require("express").Router;
const router = Router();
const yt_el_pitazo = require("../controller/yt_el_pitazo.js");
const elPitazoController = () => router.get("/el_pitazo", yt_el_pitazo);
module.exports = elPitazoController;
