const aiConfig = require('../config/ai.config');

// ===== Garante fetch no Node =====
let fetchFn;
try {
  fetchFn = fetch;
} catch {
  fetchFn = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
}

/**
 * Normaliza a resposta independente do provider
 */
function extractReply(provider, data) {
  if (data?.choices?.[0]?.message?.content) {
    return data.choices[0].message.content;
  }

  throw new Error(`Resposta inválida da IA (${provider})`);
}

async function callAI(prompt) {
  if (!aiConfig.apiKey || aiConfig.apiKey.length < 20) {
    throw new Error(
      `API Key inválida ou não configurada para o provider: ${aiConfig.provider}`
    );
  }

  // ===== PAYLOAD =====
  const payload = {
    model: aiConfig.model,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  };

  // ===== HEADERS PADRÃO =====
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${aiConfig.apiKey}`
  };

  // Merge headers extras se existirem
  if (aiConfig.headers && typeof aiConfig.headers === 'object') {
    Object.assign(headers, aiConfig.headers);
  }

  // Reforço específico OpenRouter
  if (aiConfig.provider === 'openrouter') {
    headers['HTTP-Referer'] =
      headers['HTTP-Referer'] || 'http://localhost:3000';
    headers['X-Title'] =
      headers['X-Title'] || 'Som Renovo AI';
  }

  let response;

  try {
    response = await fetchFn(aiConfig.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
  } catch {
    throw new Error('Falha de conexão com o serviço de IA');
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Erro na IA (${aiConfig.provider}) [${response.status}]: ${errorText}`
    );
  }

  const data = await response.json();
  return extractReply(aiConfig.provider, data);
}

module.exports = { callAI };