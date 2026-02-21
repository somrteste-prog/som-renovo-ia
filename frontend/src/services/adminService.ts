const API_URL = import.meta.env.VITE_WEBHOOK_URL as string;

// =============================
// MEMORY
// =============================
export async function getMemory() {
  const response = await fetch(`${API_URL}/admin/memory`);
  if (!response.ok) throw new Error("Erro ao buscar memory");
  return await response.json();
}

// =============================
// INSIGHTS
// =============================
export async function getInsights() {
  const response = await fetch(`${API_URL}/admin/insights`);
  if (!response.ok) throw new Error("Erro ao buscar insights");
  return await response.json();
}

// =============================
// PROMPT
// =============================
export async function getPrompt() {
  const response = await fetch(`${API_URL}/admin/prompt`);
  if (!response.ok) throw new Error("Erro ao buscar prompt");
  return await response.json();
}

export async function updatePrompt(prompt: string) {
  const response = await fetch(`${API_URL}/admin/prompt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) throw new Error("Erro ao atualizar prompt");

  return await response.json();
}

// =============================
// RESET MEMORY
// =============================
export async function resetMemory() {
  const response = await fetch(`${API_URL}/admin/reset`, {
    method: "POST",
  });

  if (!response.ok) throw new Error("Erro ao resetar memória");

  return await response.json();
}