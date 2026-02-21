import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = import.meta.env.VITE_WEBHOOK_URL;

const Dashboard = () => {
  const { user } = useAuth();

  const [memory, setMemory] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const memoryRes = await fetch(`${API_URL}/admin/memory`);
      const insightsRes = await fetch(`${API_URL}/admin/insights`);

      const memoryData = await memoryRes.json();
      const insightsData = await insightsRes.json();

      setMemory(memoryData);
      setInsights(insightsData);
    } catch (error) {
      console.error("Erro ao carregar dados do admin:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Bem-vindo{user ? `, ${user.name}` : ""} 👋
      </h1>

      <p className="text-gray-600 dark:text-gray-300">
        Este é o painel principal do Som Renovo AI.
      </p>

      {/* Cards principais */}
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
          <h2 className="font-semibold mb-2">Admin Backend</h2>
          <p className="text-sm text-gray-500">
            {loading
              ? "Carregando..."
              : memory
              ? "Conectado com sucesso"
              : "Sem conexão"}
          </p>
        </div>
      </div>

      {/* Seção Admin */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-4 rounded-xl border bg-white dark:bg-gray-800">
            <h2 className="font-semibold mb-2">Memory</h2>
            <pre className="text-xs overflow-auto text-gray-500">
              {JSON.stringify(memory, null, 2)}
            </pre>
          </div>

          <div className="p-4 rounded-xl border bg-white dark:bg-gray-800">
            <h2 className="font-semibold mb-2">Insights</h2>
            <pre className="text-xs overflow-auto text-gray-500">
              {JSON.stringify(insights, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;