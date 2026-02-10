const multer = require('multer');

const storage = multer.memoryStorage();

const uploadAudio = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB (limite seguro para Whisper)
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('audio/')) {
      return cb(new Error('Arquivo enviado não é um áudio'));
    }
    cb(null, true);
  }
});

module.exports = uploadAudio;
