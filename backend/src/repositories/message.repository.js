const db = require('../database/db');

/**
 * Cria uma nova mensagem dentro de uma conversa
 * @param {Object} params
 * @param {string} params.conversationId - UUID da conversa
 * @param {string} params.role - "user" ou "assistant"
 * @param {string} params.content - Conteúdo da mensagem
 * @returns {Promise<{id: string}>} - ID da mensagem criada
 */
async function createMessage({ conversationId, role, content }) {
  if (!conversationId) {
    throw new Error('conversationId é obrigatório para criar uma mensagem');
  }

  if (!role || !['user', 'assistant'].includes(role)) {
    throw new Error('role inválido. Deve ser "user" ou "assistant"');
  }

  if (!content || content.trim().length === 0) {
    throw new Error('content não pode ser vazio');
  }

  const query = `
    INSERT INTO messages (conversation_id, role, content)
    VALUES ($1, $2, $3)
    RETURNING id;
  `;

  const values = [conversationId, role, content.trim()];

  try {
    const result = await db.query(query, values);
    if (!result.rows[0]) {
      throw new Error('Falha ao criar mensagem');
    }
    return result.rows[0];
  } catch (err) {
    console.error('Erro em createMessage:', err);
    throw err;
  }
}

module.exports = {
  createMessage
};