const multer = require('multer');

function errorHandler(err, req, res, next) {
  // Erros específicos do Multer
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: err.message
    });
  }

  // Erro lançado manualmente no fileFilter
  if (err.message === 'Arquivo enviado não é um áudio') {
    return res.status(400).json({
      error: err.message
    });
  }

  // Erros genéricos conhecidos
  if (err.message) {
    return res.status(400).json({
      error: err.message
    });
  }

  // Fallback real (último caso)
  return res.status(500).json({
    error: 'Erro interno do servidor'
  });
}

module.exports = errorHandler;
