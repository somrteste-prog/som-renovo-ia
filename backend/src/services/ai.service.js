const aiConfig = require('../config/ai.config');

/**
 * Normaliza a resposta independente do provider
 */
function extractReply(provider, data) {
  // OpenAI / OpenRouter padrão
  if (data?.choices?.[0]?.message?.content) {
    return data.choices[0].message.content;
  }

  throw new Error(`Resposta inválida da IA (${provider})`);
}

async function callAI(prompt) {
  if (!aiConfig.enabled) {
    throw new Error('IA de texto está desativada');
  }

  if (!aiConfig.apiKey || aiConfig.apiKey.length < 20) {
    throw new Error(
      `API Key inválida ou não configurada para o provider: ${aiConfig.provider}`
    );
  }

  if (typeof fetch !== 'function') {
    throw new Error('fetch não disponível no ambiente Node');
  }

  const payload = {
    model: aiConfig.model,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  };

  let response;

  try {
    response = await fetch(aiConfig.endpoint, {
      method: 'POST',
      headers: aiConfig.headers,
      body: JSON.stringify(payload),
    });
  } catch (err) {
    throw new Error('Falha de conexão com o serviço de IA');
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Erro na IA (${aiConfig.provider}) [${response.status}]: ${errorText}`
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Resposta inválida (JSON) da IA');
  }

  return extractReply(aiConfig.provider, data);
}

module.exports = { callAI };