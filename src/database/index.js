console.log('database/index.js foi carregado');
const { Pool } = require('pg');
const dbConfig = require('../config/database');

const pool = new Pool(dbConfig);

async function testConnection() {
  try {
    const result = await pool.query('SELECT 1');
    console.log('✅ PostgreSQL conectado com sucesso');
    return result;
  } catch (error) {
    console.error('❌ Erro ao conectar no PostgreSQL:', error.message);
    process.exit(1);
  }
}

testConnection();

module.exports = pool;