import { Router } from "express";
import periodico_occidente from "../controller/periodico_occidente.mjs";
const router = Router();
const periodicoOccidente = () => router.post("/periodico_occidente", periodico_occidente);
export default periodicoOccidente;
