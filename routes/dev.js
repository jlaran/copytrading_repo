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

router.get("/debug/reset-db", async (req, res) => {
    try {
      await db.query(`
        DROP TABLE IF EXISTS executions;
        DROP TABLE IF EXISTS signals;
        DROP TABLE IF EXISTS ea_clients;
  
        CREATE TABLE IF NOT EXISTS ea_clients (
            id SERIAL PRIMARY KEY,
            account_number TEXT UNIQUE NOT NULL,
            api_key TEXT UNIQUE NOT NULL,
            enabled BOOLEAN DEFAULT TRUE,
            name TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS signals (
            id SERIAL,
            signal_id TEXT NOT NULL PRIMARY KEY,
            symbol TEXT NOT NULL,
            order_type TEXT NOT NULL,
            lot REAL NOT NULL,
            entry_price REAL NOT NULL,
            tp1 REAL,
            tp2 REAL,
            sl REAL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS executions (
            id SERIAL PRIMARY KEY,
            signal_id TEXT REFERENCES signals(signal_id),
            account_number TEXT,
            api_key TEXT,
            result TEXT,
            notes TEXT,
            execution_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      res.send("✅ Base de datos reiniciada exitosamente.");
    } catch (err) {
      console.error(err);
      res.status(500).send("❌ Error al reiniciar la base de datos.");
    }
  });
  
  

module.exports = router;