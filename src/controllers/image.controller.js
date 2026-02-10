const { generateImage } = require('../services/image.service');

async function createImage(req, res, next) {
  try {
    const { prompt } = req.body;

    const imageUrl = await generateImage(prompt);

    res.json({
      prompt,
      imageUrl,
      meta: {
        provider: process.env.IMAGE_PROVIDER,
        model: process.env.IMAGE_MODEL,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error); // 👉 cai no middleware global de erro
  }
}

module.exports = { createImage };
