// routes/access.js
const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/check_access", async (req, res) => {
  const { account_number, license_key } = req.query;

  if (!account_number || !license_key)
    return res.status(400).json({ error: "account_number y license_key requeridos" });

  try {
    const result = await db.query(
      `SELECT enabled FROM ea_clients WHERE account_number = $1 AND license_key = $2`,
      [account_number, license_key]
    );

    if (result.rows.length === 0)
      return res.status(403).json({ authorized: false, reason: "No registrado" });

    if (!result.rows[0].enabled)
      return res.status(403).json({ authorized: false, reason: "Acceso deshabilitado" });

    return res.json({ authorized: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;