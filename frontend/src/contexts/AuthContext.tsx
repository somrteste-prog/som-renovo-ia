import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type User = {
  id: string;
  name: string;
  email?: string; // guest não tem email
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
};

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  loginGuest: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("@auth:user");
    const storedToken = localStorage.getItem("@auth:token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setIsGuest(false);
    }
  }, []);

  async function login(email: string, password: string) {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Credenciais inválidas");

    const data = await response.json();

    setUser(data.user);
    setToken(data.token);
    setIsGuest(false);

    localStorage.setItem("@auth:user", JSON.stringify(data.user));
    localStorage.setItem("@auth:token", data.token);
  }

  function loginGuest() {
    setUser(null);
    setToken(null);
    setIsGuest(true);

    localStorage.removeItem("@auth:user");
    localStorage.removeItem("@auth:token");
  }

  function logout() {
    setUser(null);
    setToken(null);
    setIsGuest(false);

    localStorage.removeItem("@auth:user");
    localStorage.removeItem("@auth:token");
  }

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isGuest, login, loginGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}