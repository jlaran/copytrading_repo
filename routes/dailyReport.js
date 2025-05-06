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

router.get("/daily-report", async (req, res) => {
  const { account, from, to } = req.query;
  let query = `SELECT account_number, date, trades_count, total_profit FROM daily_reports`;
  const conditions = [];
  const params = [];

  if (account) {
    conditions.push(`account_number = $${params.length + 1}`);
    params.push(account);
  }
  if (from) {
    conditions.push(`date >= $${params.length + 1}`);
    params.push(from);
  }
  if (to) {
    conditions.push(`date <= $${params.length + 1}`);
    params.push(to);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }
  query += ` ORDER BY date DESC`;

  try {
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener el resumen diario");
  }
});

module.exports = router;
