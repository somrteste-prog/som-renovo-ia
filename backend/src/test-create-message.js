const { createMessage } = require('./repositories/message.repository');

async function test() {
  const message = await createMessage({
    conversationId: 'acb0cf5e-5f54-42dc-92fa-b75a82a52639',
    role: 'user',
    content: 'Preciso de ideias para aulas de música'
  });

  console.log('Mensagem criada:', message);
  process.exit(0);
}

test();