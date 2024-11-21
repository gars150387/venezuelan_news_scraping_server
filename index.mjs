import express from "express";
import portuguesaReporta from "./router/portuguesa_report.mjs";
import { configDotenv } from "dotenv";
import periodicoOccidente from "./router/periodico_occidente.mjs";

configDotenv(".env");
// CORS configuration
const ACCEPTED_ORIGINS = [];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-token"],
  // preflightContinue: false,
  maxAge: 84600,
  optionsSuccessStatus: 200,
};

//create express server
const app = express();

// app.use(cors(corsOptions));

// // Handle pre-flight requests
// app.options("*", cors(corsOptions));

//public directory
app.use(express.static("public"));

//Read and body parse
app.use(express.json({ limit: "1mb" }));

app.use("/api/portuguesa_reporta_", portuguesaReporta());
app.use("/api/periodico_occidente_", periodicoOccidente());

const port = process.env.PORT;
app.listen(port, () => console.log(`Started in port:${port}`));
