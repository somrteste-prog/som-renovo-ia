const express = require('express');
const { chatController } = require('../controllers/chat.controller');
const {
  authenticateToken,
  authorizeRoles
} = require('../middlewares/auth.middleware');

const router = express.Router();

// Endpoint do chat protegido
router.post(
  '/chat',
  authenticateToken,
  authorizeRoles('admin', 'mentor', 'student'),
  chatController
);

module.exports = router;