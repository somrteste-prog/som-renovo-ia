import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { login, loginGuest } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;

    try {
      await login(email, password);
      navigate("/dashboard"); // usuário real vai pro dashboard
    } catch (err) {
      alert("Credenciais inválidas");
    }
  }

  function handleGuest() {
    loginGuest();
    navigate("/home"); // guest vai direto pro chat
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm p-6 rounded-xl shadow-md border">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Senha"
            className="w-full px-4 py-2 border rounded-md"
            required
          />

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-black text-white hover:opacity-90"
          >
            Entrar
          </button>
        </form>

        <hr className="my-4 border-gray-300" />

        <button
          type="button"
          onClick={handleGuest}
          className="w-full py-2 rounded-md bg-gray-500 text-white hover:opacity-90"
        >
          Entrar como visitante
        </button>
      </div>
    </div>
  );
};

export default Login;