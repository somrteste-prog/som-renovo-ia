import { ThemeToggle } from '@/components/ThemeToggle';
import logo from '@/assets/logo.jpeg';
import NotificationsDropdown from "@/components/NotificationsDropdown";
import ProfileDropdown from "@/components/ProfileDropdown";
import { useNavigate } from "react-router-dom";

interface ChatHeaderProps {
  onLogout: () => void;
  user: {
    name: string;
    email: string;
  } | null;
}

export function 
ChatHeader({ onLogout, user }: ChatHeaderProps) 

{
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md" />
            <img
              src={logo}
              alt="Som Renovo"
              className="relative h-10 w-10 rounded-xl object-cover ring-2 ring-primary/20"
            />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground leading-tight">
              Som Renovo IA
            </h1>
            <p className="text-xs text-muted-foreground">
              Assistente Interno
            </p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <NotificationsDropdown />

          <ProfileDropdown
            name={user?.name || "Usuario"}
            email={user?.email || ""}
            onLogout={onLogout}
            onProfile={() => navigate("/perfil")}
            onSettings={() => navigate("/config")}
            onAvatarChange={(file) => {
              console.log("Avatar selecionado:", file);
            }}
          />
        </div>
      </div>
    </header>
  );
}