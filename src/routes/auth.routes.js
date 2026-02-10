const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// POST /api/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // MOCK — depois conecta no banco
  if (email === 'admin@somrenovo.ai' && password === '123456') {
    const user = {
      id: '1',
      name: 'Admin',
      email,
    };

    // Gera token JWT corretamente
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ user, token });
  }

  return res.status(401).json({ error: 'Credenciais inválidas' });
});

module.exports = router;