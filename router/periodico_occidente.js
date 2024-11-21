const Router = require("express").Router;
const periodico_occidente = require("../controller/periodico_occidente.js");
const router = Router();
const periodicoOccidente = () => router.post("/periodico_occidente", periodico_occidente);
module.exports = periodicoOccidente;
