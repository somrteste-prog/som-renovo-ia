import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export type Role = "student" | "mentor" | "admin";

export type User = {
  id: string;
  name: string;
  email?: string;
  role: Role;
  instrument?: string;
  levelDescription?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  loading: boolean;
};

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  loginGuest: () => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔎 Carrega sessão do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("@auth:user");
    const storedToken = localStorage.getItem("@auth:token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setIsGuest(false);
    }

    setLoading(false);
  }, []);

  // 🔐 Login usuário real
  async function login(email: string, password: string) {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Credenciais inválidas");

      const data = await response.json();

      // Valida role e dados
      if (!data.user || !data.token) throw new Error("Resposta inválida do servidor");

      setUser(data.user);
      setToken(data.token);
      setIsGuest(false);

      localStorage.setItem("@auth:user", JSON.stringify(data.user));
      localStorage.setItem("@auth:token", data.token);
    } finally {
      setLoading(false);
    }
  }

  // 👤 Login visitante
  function loginGuest() {
    setUser(null);
    setToken(null);
    setIsGuest(true);

    localStorage.removeItem("@auth:user");
    localStorage.removeItem("@auth:token");
  }

  // 🔄 Atualiza dados do usuário (instrumento, nível, etc.)
  function updateUser(data: Partial<User>) {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("@auth:user", JSON.stringify(updatedUser));
  }

  // 🚪 Logout
  function logout() {
    setUser(null);
    setToken(null);
    setIsGuest(false);

    localStorage.removeItem("@auth:user");
    localStorage.removeItem("@auth:token");
  }

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isGuest,
        loading,
        login,
        loginGuest,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}