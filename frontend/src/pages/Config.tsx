import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, User, Settings, ArrowLeft } from "lucide-react";

const Config = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-red-600 hover:opacity-80 transition"
        >
          <ArrowLeft size={18} />
          Voltar para Home
        </button>
      </div>

      <div className="max-w-4xl space-y-10">
        {/* Título */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Configurações
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie sua conta e personalize sua experiência.
          </p>
        </div>

        {/* 👤 Perfil */}
        <section className="p-6 rounded-2xl border bg-white dark:bg-gray-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <User className="text-red-600" size={20} />
            <h2 className="text-xl font-semibold">Perfil</h2>
          </div>

          <div className="grid gap-3 text-sm text-gray-600 dark:text-gray-300">
            <p>
              <strong>Nome:</strong> {user?.name ?? "—"}
            </p>
            <p>
              <strong>Email:</strong> {user?.email ?? "—"}
            </p>
            <p>
              <strong>Perfil:</strong>{" "}
              <span className="capitalize">
                {user?.role ?? "usuário"}
              </span>
            </p>
          </div>
        </section>

        {/* ⚙ Preferências */}
        <section className="p-6 rounded-2xl border bg-white dark:bg-gray-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="text-red-600" size={20} />
            <h2 className="text-xl font-semibold">Preferências</h2>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <p>• Tema claro / escuro (controlado no topo)</p>
            <p>• Idioma (em breve)</p>
            <p>• Integrações com IA (em breve)</p>
            <p>• Notificações (em breve)</p>
          </div>
        </section>

        {/* 🔐 Segurança */}
        <section className="p-6 rounded-2xl border bg-white dark:bg-gray-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="text-red-600" size={20} />
            <h2 className="text-xl font-semibold">Segurança</h2>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <p>• Alteração de senha (em breve)</p>
            <p>• Sessões ativas (em breve)</p>
          </div>

          <button
            onClick={logout}
            className="mt-4 px-5 py-2 rounded-lg bg-red-600 text-white hover:opacity-90 transition"
          >
            Sair da conta
          </button>
        </section>
      </div>
    </div>
  );
};

export default Config;