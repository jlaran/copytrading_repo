// middleware/auth.js
module.exports = function (req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.MASTER_API_KEY) {
      return res.status(403).json({ error: "Acceso denegado" });
    }
    next();
  };  