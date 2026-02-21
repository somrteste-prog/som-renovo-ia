const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// POST /auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  let user = null;

  // MOCK — depois conecta no banco
  if (email === 'admin@somrenovo.ai' && password === '123456') {
    user = {
      id: '1',
      name: 'Admin',
      email,
      role: 'admin'
    };
  }

  if (email === 'mentor@somrenovo.ai' && password === '123456') {
    user = {
      id: '2',
      name: 'Mentor',
      email,
      role: 'mentor'
    };
  }

  if (email === 'aluno@somrenovo.ai' && password === '123456') {
    user = {
      id: '3',
      name: 'Aluno',
      email,
      role: 'student'
    };
  }

  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // Gera token JWT corretamente
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

  return res.json({ user, token });
});

module.exports = router;