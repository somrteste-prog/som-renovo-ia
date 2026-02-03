// auth.middleware.js
require('dotenv').config();

/**
 * Middleware para verificar API Key no header
 * Header esperado: x-api-key
 */
function verifyApiKey(req, res, next) {
  const key = req.headers['x-api-key'];

  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({
      error: 'Acesso não autorizado: API Key inválida'
    });
  }

  // Chave correta, segue para o próximo middleware / controller
  next();
}

module.exports = { verifyApiKey };

