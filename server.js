// copytrading-backend/server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { syncGoogleSheet } = require("./services/googleSheetSync");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use(require("./routes/signals"));
app.use(require("./routes/executions"));
app.use(require("./routes/access"));
app.use(require("./routes/dev"));

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`✈️ Backend escuchando en http://localhost:${port}`);
  await syncGoogleSheet(); // sincroniza Google Sheet al iniciar

  // Opcional: sincroniza cada 30 minutos
  setInterval(syncGoogleSheet, 1000 * 60 * 1);
});