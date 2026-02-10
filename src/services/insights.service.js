const fs = require('fs');
const path = require('path');

const insightsPath = path.join(__dirname, '../../memory/insights.json');

function initializeInsights() {
  const initialInsights = {
    topIntents: {},
    topTopics: {},
    lastUpdated: null
  };

  fs.mkdirSync(path.dirname(insightsPath), { recursive: true });
  fs.writeFileSync(insightsPath, JSON.stringify(initialInsights, null, 2));
  return initialInsights;
}

function readInsights() {
  if (!fs.existsSync(insightsPath)) {
    return initializeInsights();
  }

  try {
    const data = fs.readFileSync(insightsPath, 'utf-8');
    return JSON.parse(data) || initializeInsights();
  } catch (error) {
    console.error('Erro ao ler insights:', error);
    return initializeInsights();
  }
}

function saveInsights(data) {
  fs.writeFileSync(insightsPath, JSON.stringify(data, null, 2));
}

function updateInsights({ intent, message }) {
  const insights = readInsights();

  // Contar intenções
  insights.topIntents[intent] = (insights.topIntents[intent] || 0) + 1;

  // Detectar temas simples
  const keywords = ['reels', 'instagram', 'youtube', 'anúncio', 'ads', 'culto', 'worship'];
  keywords.forEach(k => {
    if (message.toLowerCase().includes(k)) {
      insights.topTopics[k] = (insights.topTopics[k] || 0) + 1;
    }
  });

  insights.lastUpdated = new Date().toISOString();

  saveInsights(insights);
}

module.exports = {
  readInsights,
  updateInsights
};

