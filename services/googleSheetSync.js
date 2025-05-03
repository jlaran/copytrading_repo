// services/googleSheetSync.js
const axios = require("axios");
const db = require("../db");

async function syncGoogleSheet() {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const [headers, ...rows] = response.data.values;

    const activeAccounts = [];

    for (const row of rows) {
      const [account_number, api_key, enabledRaw, name] = row;
      const enabled = enabledRaw.toLowerCase() === "true";
    
      activeAccounts.push(account_number); // 👈 acumulamos cuentas válidas
    
      await db.query(
        `INSERT INTO ea_clients (account_number, api_key, enabled, name)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (account_number)
         DO UPDATE SET api_key = $2, enabled = $3, name = $4, updated_at = NOW()`,
        [account_number, api_key, enabled, name]
      );
    }
    
    // 🔥 eliminar los que ya no están en el spreadsheet
    if (activeAccounts.length > 0) {
      const placeholders = activeAccounts.map((_, i) => `$${i + 1}`).join(",");
      const deleteQuery = `DELETE FROM ea_clients WHERE account_number NOT IN (${placeholders})`;
      await db.query(deleteQuery, activeAccounts);
    }
    
    console.log("\u2705 EA clients sincronizados desde Google Sheets");
  } catch (err) {
    console.error("\u274c Error al sincronizar hoja de c\u00e1lculo:", err.message);
  }
}

module.exports = { syncGoogleSheet };