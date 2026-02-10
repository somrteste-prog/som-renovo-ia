function postProcessTranscription(text, options = {}) {
  let output = text;

  // Remover espaços duplicados
  output = output.replace(/\s+/g, ' ').trim();

  // Capitalizar primeira letra
  output = output.charAt(0).toUpperCase() + output.slice(1);

  // Pontuação simples (opcional)
  if (options.ensurePunctuation && !/[.!?]$/.test(output)) {
    output += '.';
  }

  return output;
}

module.exports = { postProcessTranscription };
