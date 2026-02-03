let fetch;
const imageConfig = require('../config/ai.image.config');

async function getFetch() {
  if (!fetch) {
    const module = await import('node-fetch');
    fetch = module.default;
  }
  return fetch;
}

function createServiceError(message, statusCode = 500, details = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (details) error.details = details;
  return error;
}

async function generateImage(prompt) {
  if (!imageConfig.enabled) {
    throw createServiceError('IA de imagens está desativada', 503);
  }

  if (!imageConfig.apiKey) {
    throw createServiceError('API Key não configurada para IA de imagens', 500);
  }

  if (!prompt || prompt.trim().length < 3) {
    throw createServiceError('Prompt inválido ou muito curto', 400);
  }

  const fetchFn = await getFetch();

  const response = await fetchFn(imageConfig.endpoint, {
    method: 'POST',
    headers: imageConfig.headers,
    body: JSON.stringify({
      model: imageConfig.model,
      prompt,
      size: '1024x1024'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw createServiceError(
      'Erro retornado pela IA de imagens',
      response.status,
      errorText
    );
  }

  const data = await response.json();

  if (!data.data || !data.data[0]?.url) {
    throw createServiceError('Resposta inválida da IA de imagens', 502, data);
  }

  return data.data[0].url;
}

module.exports = { generateImage }