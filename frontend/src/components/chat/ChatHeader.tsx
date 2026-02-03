import { useState } from 'react';
import { Settings, Trash2, LogOut, User, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UserContext } from '@/types/chat';
import { ThemeToggle } from '@/components/ThemeToggle';
import logo from '@/assets/logo.jpeg';

interface ChatHeaderProps {
  userContext: UserContext;
  onUpdateContext: (context: UserContext) => void;
  onClearChat: () => void;
  onLogout: () => void;
  messageCount: number;
}

export function ChatHeader({ userContext, onUpdateContext, onClearChat, onLogout, messageCount }: ChatHeaderProps) {
  const [name, setName] = useState(userContext.name);
  const [sector, setSector] = useState(userContext.sector);

  const handleSave = () => {
    onUpdateContext({ ...userContext, name, sector });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md" />
            <img src={logo} alt="Som Renovo" className="relative h-10 w-10 rounded-xl object-cover ring-2 ring-primary/20" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground leading-tight">Som Renovo IA</h1>
            <p className="text-xs text-muted-foreground">Assistente Interno</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted">
                <Settings className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[320px] sm:w-[400px]">
              <SheetHeader className="text-left">
                <SheetTitle>Configurações</SheetTitle>
                <SheetDescription>Personalize sua experiência</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Identificação
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Seu nome</label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} onBlur={handleSave} placeholder="Como você quer ser chamado?" className="h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" />
                        Setor
                      </label>
                      <Input value={sector} onChange={(e) => setSector(e.target.value)} onBlur={handleSave} placeholder="Ex: Atendimento, Pedagógico, Marketing..." className="h-10" />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-foreground">Ações</h3>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start gap-2 h-10" disabled={messageCount === 0}>
                        <Trash2 className="h-4 w-4" />
                        Limpar conversa
                        {messageCount > 0 && <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{messageCount}</span>}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Limpar conversa?</AlertDialogTitle>
                        <AlertDialogDescription>Esta ação vai apagar todas as mensagens. Você não poderá recuperar o histórico depois.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={onClearChat} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Limpar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button variant="outline" className="w-full justify-start gap-2 h-10 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30" onClick={onLogout}>
                    <LogOut className="h-4 w-4" />
                    Sair da conta
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
