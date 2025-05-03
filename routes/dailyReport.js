// routes/dailyReport.js
const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/daily-report", async (req, res) => {
  const { account_number, date, trades_count, total_profit } = req.body;

  if (!account_number || !date) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    await db.query(
      `INSERT INTO daily_reports (account_number, date, trades_count, total_profit)
       VALUES ($1, $2, $3, $4)`,
      [account_number, date, trades_count, total_profit]
    );

    res.json({ message: "Resumen guardado correctamente" });
  } catch (err) {
    console.error("❌ Error al guardar resumen:", err.message);
    res.status(500).json({ error: "Error al guardar el resumen" });
  }
});

module.exports = router;
