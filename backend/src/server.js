require('dotenv').config();
const app = require('./app');
const express = require('express');
const cors = require('cors');

// Cria o servidor
const server = express();

// Habilita CORS para permitir requisições do frontend
server.use(cors({
  origin: process.env.FRONTEND_URL || '*', // substitua pelo seu frontend real em produção
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para interpretar JSON
server.use(express.json());

// Importa o router do chat
const chatRouter = require('./routes/chat.route');
server.use('/api', chatRouter); // agora seu endpoint será /api/chat

// Start do servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
