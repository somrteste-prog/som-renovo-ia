import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="p-4 border-b bg-white dark:bg-gray-800">
          <button
            onClick={() => navigate("/home")}
            className="text-sm font-medium hover:underline"
          >
            ← Voltar para Home
          </button>
        </header>

        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}