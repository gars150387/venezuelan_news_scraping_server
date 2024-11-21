import { Router } from "express";
import portuguesa_reporta from "../controller/portuguesa_reporta.mjs";
const router = Router();
const portuguesaReporta = () => router.post("/portuguesa_report", portuguesa_reporta);
export default portuguesaReporta;
