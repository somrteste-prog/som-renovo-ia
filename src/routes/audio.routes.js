const express = require('express');
const router = express.Router();

const uploadAudio = require('../middlewares/uploadAudio');
const { transcribe } = require('../controllers/audio.controller');

// rota de transcrição
router.post(
  '/transcribe',
  uploadAudio.single('audio'),
  transcribe
);

module.exports = router;

