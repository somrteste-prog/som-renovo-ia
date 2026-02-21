import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Building2, ArrowRight, Music, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.jpeg";

const SECTORS = ["Atendimento", "Pedagógico", "Marketing", "Administrativo"];
const ADMIN_SECRET = "admin123"; // Senha extra para criar conta admin/mentor

export function LoginScreen() {
  const { login, loginGuest, updateUser } = useAuth();
  const navigate = useNavigate();

  // Estados gerais
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [step, setStep] = useState<"credentials" | "info">("credentials");
  const [isLoading, setIsLoading] = useState(false);

  // Campos do usuário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "mentor" | "admin">("student");
  const [sector, setSector] = useState("");
  const [secretKey, setSecretKey] = useState("");

  // Funções
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setIsLoading(true);
      await login(email.trim(), password.trim());

      const { user } = JSON.parse(localStorage.getItem("@auth:user") || "{}");
      if (user?.role === "admin") navigate("/dashboard");
      else navigate("/home");
    } catch {
      alert("Credenciais inválidas");
      setIsLoading(false);
    }
  }

  async function handleSignupStep(e: React.FormEvent) {
    e.preventDefault();

    // Primeiro passo: email e senha
    if (step === "credentials") {
      if (!email || !password) return;
      setStep("info");
      return;
    }

    // Segundo passo: info adicionais
    if (!name || !sector) return;

    if ((role === "admin" || role === "mentor") && secretKey !== ADMIN_SECRET) {
      alert("Chave secreta inválida para criar conta admin/mentor");
      return;
    }

    // Aqui chamaria API real para criar conta, mas vamos simular login
    const simulatedUser = {
      id: Date.now().toString(),
      name,
      email,
      role,
      sector,
    };
    localStorage.setItem("@auth:user", JSON.stringify({ user: simulatedUser, token: "guest" }));

    // Atualiza contexto
    updateUser(simulatedUser);

    // Redireciona
    if (role === "admin") navigate("/dashboard");
    else navigate("/home");
  }

  function handleGuest() {
    loginGuest();
    navigate("/home");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="relative px-6 pt-12 pb-8 text-center">
        <img
          src={logo}
          alt="Som Renovo"
          className="h-20 w-20 rounded-2xl mx-auto mb-4 shadow-xl"
        />
        <h1 className="text-2xl font-bold">Som Renovo IA</h1>
        <p className="text-sm text-muted-foreground">Assistente interno inteligente</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-sm mx-auto space-y-6">
          {/* Modo Login */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>

              <Button type="submit" className="w-full h-12 som-gradient" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <Button type="button" variant="outline" className="w-full h-12" onClick={handleGuest}>
                Entrar como visitante
              </Button>

              <p className="text-sm text-center text-muted-foreground mt-2">
                Não tem conta?{" "}
                <button
                  type="button"
                  className="text-primary font-medium"
                  onClick={() => {
                    setMode("signup");
                    setStep("credentials");
                  }}
                >
                  Criar conta
                </button>
              </p>
            </form>
          )}

          {/* Modo Criar Conta */}
          {mode === "signup" && (
            <form onSubmit={handleSignupStep} className="space-y-4">
              {step === "credentials" && (
                <>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 som-gradient">
                    Continuar
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </>
              )}

              {step === "info" && (
                <>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-12"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" /> Setor
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {SECTORS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className={cn(
                            "px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200",
                            sector === s
                              ? "bg-primary text-primary-foreground border-primary shadow-md"
                              : "bg-card text-card-foreground border-border hover:border-primary/30 hover:bg-muted"
                          )}
                          onClick={() => setSector(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <Input
                      type="text"
                      placeholder="Ou digite outro setor..."
                      value={SECTORS.includes(sector) ? "" : sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="h-10 text-sm"
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Tipo de conta</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full h-12 border rounded-md px-3"
                    >
                      <option value="student">Aluno</option>
                      <option value="mentor">Mentor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {/* Chave secreta para mentor/admin */}
                  {(role === "admin" || role === "mentor") && (
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Chave secreta"
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-12"
                      onClick={() => setStep("credentials")}
                    >
                      Voltar
                    </Button>
                    <Button type="submit" className="flex-1 h-12 som-gradient">
                      Criar conta
                    </Button>
                  </div>
                </>
              )}

              <p className="text-sm text-center text-muted-foreground mt-2">
                Já tem conta?{" "}
                <button
                  type="button"
                  className="text-primary font-medium"
                  onClick={() => setMode("login")}
                >
                  Entrar
                </button>
              </p>
            </form>
          )}
        </div>
      </div>

      <div className="px-6 py-4 text-center text-xs text-muted-foreground/60">
        Som Renovo IA — Sistema interno
      </div>
    </div>
  );
}