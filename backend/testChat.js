async function testChat() {
  const payload = {
    mensagem: "Preciso de uma ideia para um anúncio",
    nome_usuario: "João",
    setor: "Marketing",
    contexto_cliente: "Teste backend"
  };

  try {
    const res = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("Resposta do chat:", data);
  } catch (err) {
    console.error("Erro ao conectar:", err);
  }
}

testChat();