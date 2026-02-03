require('dotenv').config();

const AI_PROVIDER = process.env.AI_PROVIDER || 'openrouter';

/**
 * Provedores suportados
 * Adicionar novos aqui NÃO afeta controller nem service
 */
const providers = {
  openrouter: {
    name: 'openrouter',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.AI_MODEL || 'deepseek/deepseek-chat',
    headers: (apiKey) => ({
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',

      // Recomendado pelo OpenRouter (opcional, mas bom)
      'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
      'X-Title': 'Som Renovo AI'
    })
  },

  openai: {
    name: 'openai',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.AI_MODEL || 'gpt-4o-mini',
    headers: (apiKey) => ({
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    })
  }
};

const activeProvider = providers[AI_PROVIDER];

if (!activeProvider) {
  throw new Error(`AI_PROVIDER inválido: ${AI_PROVIDER}`);
}

module.exports = {
  enabled: process.env.AI_AI_ENABLED !== 'false',
  provider: activeProvider.name,
  endpoint: activeProvider.endpoint,
  apiKey: activeProvider.apiKey,
  model: activeProvider.model,
  headers: activeProvider.headers(activeProvider.apiKey)
};
