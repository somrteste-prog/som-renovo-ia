import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Bem-vindo{user ? `, ${user.name}` : ""} 👋
      </h1>

      <p className="text-gray-600 dark:text-gray-300">
        Este é o painel principal do Som Renovo AI.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 rounded-xl border bg-white dark:bg-gray-800">
          <h2 className="font-semibold mb-2">Status</h2>
          <p className="text-sm text-gray-500">
            Sistema ativo e autenticado
          </p>
        </div>

        <div className="p-4 rounded-xl border bg-white dark:bg-gray-800">
          <h2 className="font-semibold mb-2">Usuário</h2>
          <p className="text-sm text-gray-500">
            {user?.name ?? "Não identificado"}
          </p>
        </div>

        <div className="p-4 rounded-xl border bg-white dark:bg-gray-800">
          <h2 className="font-semibold mb-2">Próximo passo</h2>
          <p className="text-sm text-gray-500">
            Integrar recursos do backend
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;