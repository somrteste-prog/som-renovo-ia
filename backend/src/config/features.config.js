module.exports = {
  // ===== MODOS DA IA =====
  modes: {
    educational: true,   // foco pedagógico
    creative: true,      // ideias, anúncios, criativos
    strategic: true,     // estratégias de crescimento
    institutional: true // tom oficial Som Renovo
  },

  // ===== FUNCIONALIDADES =====
  features: {
    imageGeneration: false, // futuro: imagens
    longAnswers: true,      // respostas longas
    memoryEnabled: true,    // usa histórico
    insightsEnabled: true   // usa insights estratégicos
  },

  // ===== LIMITES =====
  limits: {
    maxHistoryItems: 20,
    maxResponseTokens: 800
  }
};
