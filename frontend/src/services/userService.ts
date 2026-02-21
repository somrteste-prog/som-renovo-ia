import { User } from "@/types/user";

const STORAGE_KEY = "somRenovoUser";

/**
 * Simula busca de usuário.
 * Hoje usa localStorage.
 * Amanhã será GET /users/:id
 */
export async function getCurrentUser(): Promise<User | null> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Atualiza dados do perfil.
 * Hoje salva localStorage.
 * Amanhã será PUT /users/:id
 */
export async function updateUser(
  data: Partial<User>
): Promise<User | null> {
  const current = await getCurrentUser();
  if (!current) return null;

  const updated: User = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Salva usuário novo (login futuro)
 */
export async function saveUser(user: User): Promise<void> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

/**
 * Remove usuário (logout)
 */
export async function removeUser(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
}