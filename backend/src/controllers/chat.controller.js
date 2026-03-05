const fs = require('fs');
const path = require('path');

const featureFlags = require('../config/features.config');
const { callAI } = require('../services/ai.service');
const { readMemory, updateMemory } = require('../services/memory.service');
const { readInsights, updateInsights } = require('../services/insights.service');
const { routeByIntent } = require('../utils/intentRouter');

const { createConversation } = require('../repositories/conversation.repository');
const { createMessage, getMessagesByConversation } = require('../repositories/message.repository');

// ===== CONTEXTO FIXO =====
const promptBasePath = path.join(__dirname, '../memory/prompt-base.md');
const promptBase = fs.existsSync(promptBasePath)
  ? fs.readFileSync(promptBasePath, 'utf-8')
  : '';

// ===== CLASSIFICADOR =====
function classifyIntent(message = '') {
  const text = message.toLowerCase();

  if (text.includes('roteiro')) return 'ROTEIRO';
  if (text.includes('ideia')) return 'IDEIA';
  if (text.includes('anúncio') || text.includes('ads')) return 'CRIATIVO';
  if (text.includes('estratégia') || text.includes('crescer')) return 'ESTRATEGIA';

  return 'GERAL';
}

// ===== CONTROLLER =====
async function chatController(req, res) {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Body da requisição está vazio ou mal formatado' });
    }

    const { mensagem, conversationId } = req.body;
    if (!mensagem || typeof mensagem !== 'string' || mensagem.trim().length < 3) {
      return res.status(400).json({ error: 'Mensagem inválida ou muito curta' });
    }

    // ===== AUTENTICAÇÃO =====
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Usuário não autenticado' });

    const userId = user.id;

    // ===== CONVERSA =====
    let convoId = conversationId;
    if (!convoId) {
      const convo = await createConversation({
        userId,
        title: mensagem.slice(0, 40),
        intent: classifyIntent(mensagem)
      });
      convoId = convo.id;
    }

    // ===== DETECÇÃO DE INTENÇÃO =====
    const intent = classifyIntent(mensagem);

    // ===== MEMÓRIA DO CHAT =====
    const memoryMessages = await getMessagesByConversation(convoId, 15); // Últimas 15 mensagens
    const memory = featureFlags?.features?.memoryEnabled
      ? memoryMessages.map(msg => ({ role: msg.role, content: msg.content }))
      : [];

    // ===== INSIGHTS =====
    const insights = featureFlags?.features?.insightsEnabled
      ? readInsights() || { topIntents: {}, topTopics: [] }
      : { topIntents: {}, topTopics: [] };

    // ===== ROTEAMENTO POR INTENÇÃO =====
    const instruction = routeByIntent(intent);

    // ===== PROMPT FINAL =====
    const finalPrompt = `
${promptBase}

----------------------

${instruction}

Histórico recente:
${memory.length
  ? memory.map(h => `- [${h.role}] ${h.content}`).join('\n')
  : '- Nenhum histórico ainda.'}

Insights estratégicos acumulados:
- Intenções mais frequentes: ${JSON.stringify(insights.topIntents)}
- Temas recorrentes: ${JSON.stringify(insights.topTopics)}

⚠️ Importante:
Você está respondendo COMO a IA da Som Renovo para o usuário com role: ${user.role}.
Não responda como uma IA genérica.

Pedido do usuário:
"${mensagem}"

Responda de forma estratégica, clara e aplicável.
`;

    // ===== SALVAR MENSAGEM DO USUÁRIO =====
    await createMessage({
      conversationId: convoId,
      role: 'user',
      content: mensagem
    });

    // ===== CHAMADA DA IA =====
    const reply = await callAI(finalPrompt, { role: user.role });

    // ===== SALVAR RESPOSTA DA IA =====
    await createMessage({
      conversationId: convoId,
      role: 'assistant',
      content: reply
    });

    // ===== ATUALIZAÇÃO DE MEMÓRIA E INSIGHTS =====
    if (featureFlags?.features?.memoryEnabled) {
      updateMemory({ intent, message: mensagem, userId });
    }

    if (featureFlags?.features?.insightsEnabled) {
      updateInsights({ intent, message: mensagem, userId });
    }

    // ===== RESPOSTA FINAL =====
    return res.json({
      resposta: reply,
      intent,
      conversationId: convoId,
      meta: {
        provider: process.env.AI_PROVIDER || 'openrouter',
        model: process.env.AI_MODEL || 'deepseek/deepseek-chat',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Erro no chatController:', error);
    return res.status(500).json({ error: error.message || 'Erro interno ao processar a mensagem' });
  }
}

module.exports = { chatController };