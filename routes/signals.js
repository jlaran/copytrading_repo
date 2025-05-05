const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/signals", async (req, res) => {
  const { id, symbol, lot, entry_price, tp1, tp2, sl, order_type } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO signals (id, symbol, lot, entry_price, tp1, tp2, sl, order_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [id, symbol, lot, entry_price, tp1, tp2, sl, order_type]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al guardar la señal");
  }
});

router.get("/signals", async (req, res) => {
  const { from, to } = req.query;

  if (from && to) {
    try {
      const result = await db.query(
        `SELECT * FROM signals
         WHERE created_at >= $1 AND created_at <= $2
         ORDER BY created_at ASC`,
        [from, to]
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error al obtener señales por rango");
    }
    return;
  }

  try {
    const result = await db.query("SELECT * FROM signals WHERE status = $1", ["pending"]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener señales");
  }
});

router.get("/signals/today", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM signals
       WHERE DATE(created_at) = CURRENT_DATE
       ORDER BY created_at ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener señales del día");
  }
});

router.get("/signals/last-hour", async (req, res) => {
  try {
    // Marcar como timeout las señales que no han sido confirmadas en 10 segundos
    await db.query(
      `UPDATE signals SET status = 'timeout'
       WHERE status = 'pending'
       AND created_at < NOW() - INTERVAL '10 seconds'`
    );

    // Obtener señales de la última hora que no estén confirmadas ni en timeout
    const result = await db.query(
      `SELECT * FROM signals
       WHERE created_at >= NOW() - INTERVAL '1 hour'
       AND status = 'pending'
       ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener señales recientes");
  }
});


router.post("/signals/acknowledge", async (req, res) => {
  const { signal_id, account_number, license_key } = req.body;
  if (!signal_id || !account_number || !license_key)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  try {
    // Registrar confirmación en tabla secundaria
    await db.query(
      `INSERT INTO signal_acknowledgements (signal_id, account_number, license_key, acknowledged_at)
        VALUES ($1, $2, $3, NOW())`,
      [signal_id, account_number, license_key]
    );
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar confirmación" });
  }
});


module.exports = router;
