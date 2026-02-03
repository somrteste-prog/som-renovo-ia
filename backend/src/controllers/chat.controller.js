const fs = require('fs'); 
const path = require('path');

const featureFlags = require('../config/features.config');
const { callAI } = require('../services/ai.service');
const { readMemory, updateMemory } = require('../services/memory.service');
const { readInsights, updateInsights } = require('../services/insights.service');
const { routeByIntent } = require('../utils/intentRouter');

// ===== CONTEXTO FIXO =====
const contextPath = path.join(__dirname, '../memory/context.json');
const promptBasePath = path.join(__dirname, '../memory/prompt-base.md');

const context = fs.existsSync(contextPath)
  ? JSON.parse(fs.readFileSync(contextPath, 'utf-8'))
  : {};

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
    // ⚠️ Protege contra body undefined
    if (!req.body) {
         return 
      res.status(400).json({ error: 'Body da requisição está vazio ou mal formatado' });
    }

    const { mensagem, nome_usuario, setor, contexto_cliente } = req.body;

    if (!mensagem || typeof mensagem !== 'string' || mensagem.trim().length < 3) {
      return res.status(400).json({
        error: 'Mensagem inválida ou muito curta'
      });
    }

    // 1️⃣ Detecta intenção
    const intent = classifyIntent(mensagem);

    // 2️⃣ Memória e insights com fallback seguro
    const memory = featureFlags?.features?.memoryEnabled
      ? readMemory() || { history: [] }
      : { history: [] };

    const insights = featureFlags?.features?.insightsEnabled
      ? readInsights() || { topIntents: {}, topTopics: [] }
      : { topIntents: {}, topTopics: [] };

    // 3️⃣ Instrução por intenção
    const instruction = routeByIntent(intent);

    // 4️⃣ Prompt final
    const finalPrompt = `
${promptBase}

----------------------

${instruction}

Histórico recente:
${memory.history.length > 0
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

    // 5️⃣ Chamada da IA
    const reply = await callAI(finalPrompt);

    // 6️⃣ Atualiza memória e insights apenas se habilitado
    if (featureFlags?.features?.memoryEnabled) {
      updateMemory({ intent, message: mensagem });
    }
    if (featureFlags?.features?.insightsEnabled) {
      updateInsights({ intent, message: mensagem });
    }

    console.log(`Intenção detectada: ${intent}`);

    // 7️⃣ Resposta
    return res.json({
  resposta: reply,
  intent,
  meta: {
    provider: process.env.AI_PROVIDER || 'openrouter',
    model: process.env.AI_MODEL || 'deepseek',
    timestamp: new Date().toISOString(),
  },
});

  } catch (error) {
    console.error('Erro no chatController:', error);

    // Retorna erro detalhado se feature flag de debug estiver ativa
    if (featureFlags?.features?.debugEnabled) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(500).json({
      error: 'Erro interno ao processar a mensagem'
    });
  }
}

module.exports = { chatController };
