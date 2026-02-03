import { useAuth } from "@/contexts/AuthContext";

const Config = () => {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Gerencie sua conta e preferências
        </p>
      </div>

      {/* Conta */}
      <section className="p-6 rounded-xl border bg-white dark:bg-gray-800 space-y-4">
        <h2 className="text-xl font-semibold">Conta</h2>

        <div className="text-sm text-gray-600 dark:text-gray-300">
          <p>
            <strong>Nome:</strong> {user?.name ?? "—"}
          </p>
          <p>
            <strong>Email:</strong> {user?.email ?? "—"}
          </p>
        </div>

        <button
          onClick={logout}
          className="mt-4 px-4 py-2 rounded-md bg-red-600 text-white hover:opacity-90"
        >
          Sair da conta
        </button>
      </section>

      {/* Preferências */}
      <section className="p-6 rounded-xl border bg-white dark:bg-gray-800 space-y-4">
        <h2 className="text-xl font-semibold">Preferências</h2>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          Em breve você poderá configurar:
        </p>

        <ul className="list-disc list-inside text-sm text-gray-500">
          <li>Tema claro / escuro</li>
          <li>Integrações com IA</li>
          <li>Idioma</li>
        </ul>
      </section>
    </div>
  );
};

export default Config;