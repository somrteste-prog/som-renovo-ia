import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-950">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;