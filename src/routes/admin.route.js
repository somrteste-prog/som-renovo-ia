const express = require('express');
const {
  getMemory,
  getInsights,
  resetMemory,
  getPrompt,
  updatePrompt
} = require('../controllers/admin.controller');

const router = express.Router();

router.get('/memory', getMemory);
router.get('/insights', getInsights);
router.post('/reset', resetMemory);
router.get('/prompt', getPrompt);
router.post('/prompt', updatePrompt);

module.exports = router;
