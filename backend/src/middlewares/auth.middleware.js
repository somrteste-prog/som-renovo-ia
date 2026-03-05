// auth.middleware.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

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

  next();
}

/**
 * Middleware para verificar JWT do usuário logado
 * Header esperado: Authorization: Bearer TOKEN
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'minhaChaveSecreta123'
    );

    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = {
  verifyApiKey,
  authenticateToken
};

/**
 * Middleware para autorizar por role
 * Ex: authorizeRoles('admin')
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Acesso permitido apenas para: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}

module.exports = {
  verifyApiKey,
  authenticateToken,
  authorizeRoles
};