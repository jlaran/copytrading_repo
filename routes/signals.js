//routes/signals.js
const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/signals", async (req, res) => {
  const { symbol, lot, entry_price, tp1, tp2, sl } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO signals (signal_id_str, symbol, lot, entry_price, tp1, tp2, sl)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [signal_id_str, symbol, lot, entry_price, tp1, tp2, sl]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al guardar la señal");
  }
});

router.get("/signals", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM signals WHERE status = $1", ["pending"]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener señales");
  }
});

module.exports = router;