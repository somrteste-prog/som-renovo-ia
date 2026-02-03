import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Settings, User, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/config", label: "Configurações", icon: Settings },
  // Adicione mais links conforme necessário
];

export default function Sidebar() {
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-black text-white flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top: Logo + Toggle */}
      <div className="flex items-center justify-between h-16 border-b border-red-700 px-3">
        {!collapsed && <span className="text-red-500 font-bold text-xl">Sr#</span>}
        <button
          className="text-gray-300 hover:text-white p-1 rounded-md"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-2 py-6 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 ${
                isActive
                  ? "bg-red-700 text-white"
                  : "text-gray-300 hover:bg-red-600 hover:text-white"
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            {!collapsed && <span className="text-sm font-medium">{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-2 py-4 border-t border-red-700">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}