const fs = require('fs');
const path = require('path');

const memoryPath = path.join(__dirname, '../../memory/memory.json');

function initializeMemory() {
  const initialMemory = {
    lastIntent: null,
    topics: [],
    history: []
  };

  fs.mkdirSync(path.dirname(memoryPath), { recursive: true });
  fs.writeFileSync(memoryPath, JSON.stringify(initialMemory, null, 2));
  return initialMemory;
}

function readMemory() {
  if (!fs.existsSync(memoryPath)) {
    return initializeMemory();
  }

  try {
    const data = fs.readFileSync(memoryPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler memória:', error);
    return initializeMemory();
  }
}

function updateMemory({ intent, message }) {
  const memory = readMemory();

  memory.lastIntent = intent;

  memory.history.push({
    role: 'user',
    content: message,
    timestamp: new Date().toISOString()
  });

  // Limite fixo de histórico (para não crescer infinitamente)
  const MAX_HISTORY_ITEMS = 20;
  if (memory.history.length > MAX_HISTORY_ITEMS) {
    memory.history.shift();
  }

  fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
}

module.exports = {
  readMemory,
  updateMemory
};

