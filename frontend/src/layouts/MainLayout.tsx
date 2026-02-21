import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle"; // ajuste se o nome for diferente

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

        {/* Conteúdo */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
  );
};

export default MainLayout;