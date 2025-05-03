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

module.exports = router;