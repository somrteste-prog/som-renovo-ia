const { transcribeAudio } = require('../services/audio.service');
const { postProcessTranscription } = require('../services/audio.postprocess.service');

async function transcribe(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Arquivo de áudio não enviado' });
    }

    const rawText = await transcribeAudio(
      req.file.buffer,
      req.file.originalname
    );

    const finalText = postProcessTranscription(rawText, {
      ensurePunctuation: true
    });

    res.json({
      text: finalText
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

module.exports = { transcribe };

