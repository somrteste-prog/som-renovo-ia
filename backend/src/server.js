require('dotenv').config();
require('./database'); // mantém sua conexão com banco

const app = require('./app'); // usa o app configurado corretamente

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});