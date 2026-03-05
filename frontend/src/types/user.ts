export interface User {
  id: string;
  name: string;
  email: string;
  sector?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  user: User;
  token: string;
}