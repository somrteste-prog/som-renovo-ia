import { useState } from 'react';
import { Mail, User, Building2, ArrowRight, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.jpeg';

interface LoginScreenProps {
  onLogin: (email: string, name: string, sector: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [sector, setSector] = useState('');
  const [step, setStep] = useState<'email' | 'info'>('email');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setStep('info');
    }
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && sector.trim()) {
      setIsLoading(true);
      // Simulate a brief loading state for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      onLogin(email.trim(), name.trim(), sector.trim());
    }
  };

  const sectors = [
    'Atendimento',
    'Pedagógico',
    'Marketing',
    'Administrativo',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 som-gradient opacity-[0.03]" />
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
        
        <div className="relative px-6 pt-12 pb-8">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl animate-pulse-slow" />
              <img
                src={logo}
                alt="Som Renovo"
                className="relative h-20 w-20 rounded-2xl object-cover ring-4 ring-background shadow-xl"
              />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Som Renovo IA</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Assistente interno inteligente
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-sm mx-auto">
          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <h2 className="text-lg font-semibold text-foreground">
                  Bem-vindo de volta!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Entre com seu email corporativo
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@somrenovo.com.br"
                    className="pl-10 h-12 text-base"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 som-gradient shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 group"
                disabled={!email.trim() || !email.includes('@')}
              >
                Continuar
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleInfoSubmit} className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <h2 className="text-lg font-semibold text-foreground">
                  Quase lá!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Complete seu perfil para começar
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Como você quer ser chamado?
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      className="pl-10 h-12 text-base"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Qual seu setor?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {sectors.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSector(s)}
                        className={cn(
                          "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border",
                          sector === s
                            ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25"
                            : "bg-card text-card-foreground border-border hover:border-primary/30 hover:bg-muted"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <Input
                    type="text"
                    value={sectors.includes(sector) ? '' : sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="Ou digite outro setor..."
                    className="h-10 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={() => setStep('email')}
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 som-gradient shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200"
                  disabled={!name.trim() || !sector.trim() || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Entrando...
                    </div>
                  ) : (
                    <>
                      Entrar
                      <Music className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 text-center">
        <p className="text-[11px] text-muted-foreground/60">
          Som Renovo IA — Feito para a equipe tomar decisões melhores
        </p>
      </div>
    </div>
  );
}
