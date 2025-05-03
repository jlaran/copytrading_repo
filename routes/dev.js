// routes/dev.js
const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/debug/clients", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM ea_clients");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener datos de clients");
    }
});

router.get("/debug/signals", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM signals");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener datos de signals");
    }
});
  
router.get("/debug/executions", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM executions");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener datos de executions");
    }
});

router.get("/debug/clear-db", async (req, res) => {
    try {
      await db.query("TRUNCATE TABLE executions, signals, ea_clients RESTART IDENTITY CASCADE");
      res.send("✅ Base de datos limpiada exitosamente.");
    } catch (err) {
      console.error(err);
      res.status(500).send("❌ Error al limpiar la base de datos.");
    }
  });
  

module.exports = router;