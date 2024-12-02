const express = require("express");
// const cors = require("cors");
const portuguesaReporta = require("./router/portuguesa_report.js");
const periodicoOccidente = require("./router/periodico_occidente.js");
const cnnEspanol = require("./router/cnnEspanol.js");
const elNacionalController = require("./router/el_nacional.js");
const carlaAngolaController = require("./router/carlaAngola.js");
const boletinController = require("./router/boleting.js");

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
  methods: ["GET"],
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
app.use("/api/cnn_espanol_", cnnEspanol());
app.use("/api/el_nacional_", elNacionalController());
app.use("/api/yt_scraper_", carlaAngolaController());
app.use("/api/boletin_", boletinController());

const port = process.env.PORT;
app.listen(port, () => console.log(`Started in port:${port}`));
