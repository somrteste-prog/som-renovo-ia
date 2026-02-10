require('dotenv').config();

const IMAGE_PROVIDER = process.env.IMAGE_PROVIDER || 'openai';

const providers = {
  openai: {
  name: 'openai',
  endpoint: 'https://api.openai.com/v1/images/generations',
  apiKey: process.env.OPENAI_API_KEY,
  defaultModel: process.env.IMAGE_MODEL || 'dall-e-3',
  headers: (apiKey) => ({
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  })
}
};

const activeProvider = providers[IMAGE_PROVIDER];

if (!activeProvider) {
  throw new Error(`IMAGE_PROVIDER inválido: ${IMAGE_PROVIDER}`);
}

module.exports = {
  enabled: process.env.IMAGE_AI_ENABLED === 'true',
  provider: activeProvider.name,
  endpoint: activeProvider.endpoint,
  apiKey: activeProvider.apiKey,
  model: activeProvider.defaultModel,
  headers: activeProvider.headers(activeProvider.apiKey)
};
