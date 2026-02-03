function routeByIntent(intent) {
  switch (intent) {
    case 'ROTEIRO':
      return `
Crie roteiros SOMENTE se o pedido mencionar explicitamente:
- vídeo
- aula gravada
- apresentação

Se for um roteiro pedagógico:
- escreva como guia interno para professores
- NÃO escreva como roteiro de vídeo para redes sociais
- use linguagem educacional e prática
`;

    case 'IDEIA':
      return `
Gere ideias estritamente alinhadas ao contexto do pedido.

Se o contexto for educacional:
- métodos de ensino
- abordagens pedagógicas
- práticas em sala ou aula individual

Se o contexto for divulgação:
- ideias estratégicas
- SEM linguagem exagerada
- SEM CTA automático
`;

    case 'CRIATIVO':
      return `
Crie materiais criativos APENAS porque o pedido exige isso.

- anúncios
- campanhas
- materiais promocionais

Use linguagem estratégica e clara.
Não transforme tudo em marketing agressivo.
`;

    case 'ESTRATEGIA':
      return `
Crie estratégias institucionais ou pedagógicas.

- crescimento da escola
- organização interna
- melhoria de ensino

Não foque exclusivamente em redes sociais.
`;

    default:
      return `
Responda de forma institucional, educativa e estratégica.

- linguagem clara
- aplicável à realidade da Escola Som Renovo
- sem assumir produção de conteúdo externo
`;
  }
}

module.exports = { routeByIntent };
