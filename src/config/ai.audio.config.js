require('dotenv').config();

const AUDIO_PROVIDER = process.env.AUDIO_PROVIDER || 'openai';

const providers = {
  openai: {
    name: 'openai',
    endpoint: 'https://api.openai.com/v1/audio/transcriptions',
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.AUDIO_MODEL || 'whisper-1',
    headers: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`
      // Content-Type NÃO vai aqui (multipart)
    })
  }

  // Futuro:
  // openrouter: {}
  // local: {}
};

const activeProvider = providers[AUDIO_PROVIDER];

if (!activeProvider) {
  throw new Error(`AUDIO_PROVIDER inválido: ${AUDIO_PROVIDER}`);
}

module.exports = {
  enabled: process.env.AUDIO_AI_ENABLED === 'true',
  provider: activeProvider.name,
  endpoint: activeProvider.endpoint,
  apiKey: activeProvider.apiKey,
  model: activeProvider.model,
  headers: activeProvider.headers(activeProvider.apiKey)
};

