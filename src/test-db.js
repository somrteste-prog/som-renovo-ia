const db = require('./database/db');

async function test() {
  try {
    await db.query('SELECT 1');
    console.log('✅ Conexão com o banco OK');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao conectar no banco');
    console.error(err.message);
    process.exit(1);
  }
}

test();