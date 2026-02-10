let fetch;
const FormData = require('form-data');
const audioConfig = require('../config/ai.audio.config');

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

async function transcribeAudio(fileBuffer, fileName) {
  if (!audioConfig.enabled) {
    throw createServiceError(
      'IA de áudio está desativada',
      503
    );
  }

  if (!audioConfig.apiKey) {
    throw createServiceError(
      'API Key de áudio não configurada',
      500
    );
  }

  if (!fileBuffer || !fileName) {
    throw createServiceError(
      'Arquivo de áudio inválido',
      400
    );
  }

  const fetchFn = await getFetch();

  const form = new FormData();
  form.append('file', fileBuffer, fileName);
  form.append('model', audioConfig.model);

  let response;

  try {
    response = await fetchFn(audioConfig.endpoint, {
      method: 'POST',
      headers: {
        ...audioConfig.headers,
        ...form.getHeaders()
      },
      body: form
    });
  } catch (err) {
    throw createServiceError(
      'Falha de conexão com o serviço de transcrição',
      502,
      err.message
    );
  }

  if (!response.ok) {
    const errorText = await response.text();

    throw createServiceError(
      'Erro retornado pela IA de transcrição',
      response.status,
      errorText
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw createServiceError(
      'Resposta inválida da IA de transcrição',
      502
    );
  }

  if (!data.text) {
    throw createServiceError(
      'Transcrição retornou vazia',
      422,
      data
    );
  }

  return data.text;
}

module.exports = { transcribeAudio };
