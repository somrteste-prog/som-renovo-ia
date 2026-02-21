const fs = require('fs');
const path = require('path');

const featureFlags = require('../config/features.config');
const { callAI } = require('../services/ai.service');
const { readMemory, updateMemory } = require('../services/memory.service');
const { readInsights, updateInsights } = require('../services/insights.service');
const { routeByIntent } = require('../utils/intentRouter');

const { createConversation } = require('../repositories/conversation.repository');
const { createMessage } = require('../repositories/message.repository');

// ===== CONTEXTO FIXO =====
const contextPath = path.join(__dirname, '../memory/context.json');
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
      return res.status(400).json({
        error: 'Body da requisição está vazio ou mal formatado'
      });
    }

    const { mensagem, conversationId } = req.body;

    if (!mensagem || typeof mensagem !== 'string' || mensagem.trim().length < 3) {
      return res.status(400).json({
        error: 'Mensagem inválida ou muito curta'
      });
    }

    // ⚠️ Provisório: UUID do usuário (substituir por autenticação real)
    const userId = '0151947b-8f29-4703-aa79-f3da165739a7';

    // ===== CONVERSA =====
    let convoId = conversationId;

    if (!convoId) {
      const convo = await createConversation({
        userId,
        title: mensagem.slice(0, 40)
      });
      convoId = convo.id;
    }

    // ===== DETECÇÃO DE INTENÇÃO =====
    const intent = classifyIntent(mensagem);

    // ===== MEMÓRIA E INSIGHTS =====
    const memory = featureFlags?.features?.memoryEnabled
      ? readMemory() || { history: [] }
      : { history: [] };

    const insights = featureFlags?.features?.insightsEnabled
      ? readInsights() || { topIntents: {}, topTopics: [] }
      : { topIntents: {}, topTopics: [] };

    const instruction = routeByIntent(intent);

    // ===== PROMPT FINAL =====
    const finalPrompt = `
${promptBase}

----------------------

${instruction}

Histórico recente:
${memory.history.length
  ? memory.history.map(h => `- ${h.content || h.message}`).join('\n')
  : '- Nenhum histórico ainda.'}

Insights estratégicos acumulados:
- Intenções mais frequentes: ${JSON.stringify(insights.topIntents)}
- Temas recorrentes: ${JSON.stringify(insights.topTopics)}

⚠️ Importante:
Você está respondendo COMO a IA DA Som Renovo.
Não responda como uma IA genérica.
Todas as ideias devem fazer sentido para uma escola de música chamada Som Renovo.

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
    const reply = await callAI(finalPrompt);

    // ===== SALVAR RESPOSTA DA IA =====
    await createMessage({
      conversationId: convoId,
      role: 'assistant',
      content: reply
    });

    // ===== ATUALIZAÇÃO DE MEMÓRIA E INSIGHTS =====
    if (featureFlags?.features?.memoryEnabled) {
      updateMemory({ intent, message: mensagem });
    }

    if (featureFlags?.features?.insightsEnabled) {
      updateInsights({ intent, message: mensagem });
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

    return res.status(500).json({
      error: error.message || 'Erro interno ao processar a mensagem'
    });
  }
}

module.exports = { chatController };