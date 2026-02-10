const db = require('../database/db');

/**
 * Cria uma nova conversa
 * @param {Object} params
 * @param {string} params.userId - UUID do usuário que inicia a conversa
 * @param {string} [params.title] - Título da conversa
 * @returns {Promise<{id: string}>} - ID da conversa criada
 */
async function createConversation({ userId, title }) {
  if (!userId) {
    throw new Error('userId é obrigatório para criar uma conversa');
  }

  const query = `
    INSERT INTO conversations (user_id, title)
    VALUES ($1, $2)
    RETURNING id;
  `;

  const values = [userId, title?.trim() || 'Nova conversa'];

  try {
    const result = await db.query(query, values);
    if (!result.rows[0]) {
      throw new Error('Falha ao criar conversa');
    }
    return result.rows[0];
  } catch (err) {
    console.error('Erro em createConversation:', err);
    throw err;
  }
}

module.exports = {
  createConversation
};