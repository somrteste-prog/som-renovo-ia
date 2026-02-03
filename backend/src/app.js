const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// =====================
// CORS
// =====================
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// =====================
// Middleware para parse de requisições
// =====================
// JSON obrigatório
app.use(express.json());
// Form-data / URL-encoded (opcional)
app.use(express.urlencoded({ extended: true }));

// =====================
// Rotas de Áudio
// =====================
app.use('/audio', require('./routes/audio.routes'));

// =====================
// Rotas de Imagens
// =====================
app.use('/api', require('./routes/image.routes'));

// =====================
// Rotas do Chat
// =====================
const chatRoutes = require('./routes/chat.route');
app.use('/api', chatRoutes);

// =====================
// Rotas Admin e Auth
// =====================
const adminRoutes = require('./routes/admin.route');
app.use('/admin', adminRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

// =====================
// Arquivos estáticos
// =====================
app.use(express.static(path.join(__dirname, 'public')));

// Rota raiz explícita
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// =====================
// Middleware global de erro
// =====================
app.use((err, req, res, next) => {
  console.error('[ERRO]', err);

  // Erro do Multer (upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'Arquivo muito grande. Limite máximo de 25MB.'
    });
  }

  if (err.message === 'Arquivo enviado não é um áudio') {
    return res.status(400).json({
      error: err.message
    });
  }

  // Erros conhecidos (lançados manualmente)
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  // Erro genérico (fallback)
  return res.status(500).json({
    error: 'Erro interno no servidor'
  });
});

module.exports = app;
