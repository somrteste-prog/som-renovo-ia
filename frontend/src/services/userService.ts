import { User } from "@/types/user";

export interface AuthUser {
  user: User;
  token: string;
}

const STORAGE_KEY = "@somrenovo:auth";

/**
 * Busca usuário autenticado + token
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

/**
 * Atualiza dados do perfil do usuário
 */
export async function updateUser(
  data: Partial<User>
): Promise<AuthUser | null> {
  const current = await getCurrentUser();
  if (!current) return null;

  const updatedUser: User = {
    ...current.user,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const updated: AuthUser = {
    user: updatedUser,
    token: current.token,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Salva usuário novo + token (login)
 */
export async function saveUser(user: User, token: string): Promise<void> {
  const data: AuthUser = { user, token };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Remove usuário + token (logout)
 */
export async function removeUser(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
}