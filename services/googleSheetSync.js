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

    for (const row of rows) {
      const [account_number, api_key, enabledRaw, name] = row;
      const enabled = enabledRaw.toLowerCase() === "true";

      await db.query(
        `INSERT INTO ea_clients (account_number, api_key, enabled, name)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (account_number)
         DO UPDATE SET api_key = $2, enabled = $3, name = $4, updated_at = NOW()`,
        [account_number, api_key, enabled, name]
      );
    }

    console.log("\u2705 EA clients sincronizados desde Google Sheets");
  } catch (err) {
    console.error("\u274c Error al sincronizar hoja de c\u00e1lculo:", err.message);
  }
}

module.exports = { syncGoogleSheet };