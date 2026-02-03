const fs = require('fs');
const path = require('path');

const memoryPath = path.join(__dirname, '../../memory/memory.json');
const insightsPath = path.join(__dirname, '../../memory/insights.json');
const promptPath = path.join(__dirname, '../../memory/prompt-base.md');

function getMemory(req, res) {
  const data = fs.readFileSync(memoryPath, 'utf-8');
  res.json(JSON.parse(data));
}

function getInsights(req, res) {
  const data = fs.readFileSync(insightsPath, 'utf-8');
  res.json(JSON.parse(data));
}

function resetMemory(req, res) {
  fs.writeFileSync(memoryPath, JSON.stringify({ history: [] }, null, 2));
  fs.writeFileSync(insightsPath, JSON.stringify({
    topIntents: {},
    topTopics: {},
    preferredFormats: {},
    lastUpdated: null
  }, null, 2));

  res.json({ status: 'Memória resetada com sucesso' });
}

function getPrompt(req, res) {
  const prompt = fs.readFileSync(promptPath, 'utf-8');
  res.json({ prompt });
}

function updatePrompt(req, res) {
  const { prompt } = req.body;
  fs.writeFileSync(promptPath, prompt);
  res.json({ status: 'Prompt atualizado' });
}

module.exports = {
  getMemory,
  getInsights,
  resetMemory,
  getPrompt,
  updatePrompt
};
