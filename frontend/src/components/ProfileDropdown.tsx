import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, Camera } from "lucide-react";

interface ProfileDropdownProps {
  name: string;
  email: string;
  avatar?: string;
  onLogout: () => void;
  onProfile?: () => void;
  onSettings?: () => void;
  onAvatarChange?: (file: File) => void;
}

export default function ProfileDropdown({
  name,
  email,
  avatar,
  onLogout,
  onProfile,
  onSettings,
  onAvatarChange,
}: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onAvatarChange) {
      onAvatarChange(e.target.files[0]);
    }
  };

  return (
    <div className="relative" ref={ref}>
      {/* Botão */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted transition"
      >
        <img
          src={
            avatar ||
            "https://ui-avatars.com/api/?name=" + encodeURIComponent(name)
          }
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover border"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-900 border rounded-2xl shadow-xl p-4 z-50">
          {/* Avatar + Nome */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <img
                src={
                  avatar ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(name)
                }
                alt="Avatar"
                className="w-14 h-14 rounded-full object-cover"
              />

              <button
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 bg-black/70 p-1 rounded-full text-white"
              >
                <Camera className="w-3 h-3" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            <div>
              <p className="font-semibold text-sm">{name}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>

          <div className="border-t my-3" />

          <button
            onClick={onProfile}
            className="w-full flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-muted"
          >
            <User className="w-4 h-4" />
            Meu Perfil
          </button>

          <button
            onClick={onSettings}
            className="w-full flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-muted"
          >
            <Settings className="w-4 h-4" />
            Configurações
          </button>

          <div className="border-t my-3" />

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 text-sm p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}