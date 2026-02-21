const { createConversation } = require('./repositories/conversation.repository');

async function test() {
  const conversation = await createConversation({
    userId: '0151947b-8f29-4703-aa79-f3da165739a7',
    title: 'Teste de conversa'
  });

  console.log('Conversação criada:', conversation);
  process.exit(0);
}

test();