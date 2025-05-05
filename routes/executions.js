// routes/executions.js
const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/executions", async (req, res) => {
  const { signal_id, result, notes, account_number, license_key } = req.body;
  try {
    await db.query(
      `INSERT INTO executions (signal_id, result, notes, account_number, license_key)
       VALUES ($1, $2, $3, $4, $5)`,
      [signal_id, result, notes, account_number, license_key]
    );

    await db.query("UPDATE signals SET status = 'executed' WHERE id = $1", [signal_id]);
    res.send("Ejecución registrada");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al registrar ejecución");
  }
});

router.post("/executions/report", async (req, res) => {
  const { account_number, symbol, volume, price, profit, reason } = req.body;
  if (!account_number || !symbol || !volume || !price) {
    return res.status(400).json({ error: "Campos requeridos faltantes" });
  }

  try {
    await db.query(
      `INSERT INTO execution_reports (account_number, symbol, volume, price, profit, reason, closed_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [account_number, symbol, volume, price, profit, reason]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error al guardar el reporte de cierre:", err);
    res.status(500).json({ error: "Error interno al guardar reporte" });
  }
});

router.get("/executions/reports", async (req, res) => {
  const { account_number, from, to } = req.query;

  let baseQuery = `SELECT * FROM execution_reports WHERE 1=1`;
  const params = [];
  let paramIndex = 1;

  if (account_number) {
    baseQuery += ` AND account_number = $${paramIndex++}`;
    params.push(account_number);
  }

  if (from && to) {
    baseQuery += ` AND closed_at BETWEEN $${paramIndex++} AND $${paramIndex++}`;
    params.push(from, to);
  }

  baseQuery += ` ORDER BY closed_at DESC`;

  try {
    const result = await db.query(baseQuery, params);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error al obtener reportes filtrados:", err);
    res.status(500).json({ error: "Error al obtener reportes" });
  }
});

module.exports = router;