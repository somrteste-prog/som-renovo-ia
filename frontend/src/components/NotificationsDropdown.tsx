import { useState } from "react";
import { Bell } from "lucide-react";

const mockNotifications = [
  { id: 1, message: "Novo aluno cadastrado." },
  { id: 2, message: "Atualização disponível no sistema." },
  { id: 3, message: "Relatório mensal pronto." },
];

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />

        {mockNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {mockNotifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 border rounded-xl shadow-lg p-4 z-50">
          <h3 className="font-semibold mb-3 text-gray-800 dark:text-white">
            Notificações
          </h3>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {mockNotifications.length > 0 ? (
              mockNotifications.map((n) => (
                <div
                  key={n.id}
                  className="text-sm p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {n.message}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                Você não tem notificações.
              </p>
            )}
          </div>

          <button className="mt-4 w-full text-sm text-red-600 hover:underline">
            Ver todas
          </button>
        </div>
      )}
    </div>
  );
}