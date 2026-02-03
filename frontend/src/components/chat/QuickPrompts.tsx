import { cn } from '@/lib/utils';
import { Lightbulb, Users, Megaphone, HelpCircle } from 'lucide-react';

interface QuickPromptsProps {
  onSelect: (prompt: string) => void;
  className?: string;
}

const quickPrompts = [
  { icon: Users, label: 'Atendimento', prompt: 'Como atender um cliente que está insatisfeito com as aulas?' },
  { icon: Lightbulb, label: 'Ideias', prompt: 'Preciso de ideias criativas para as redes sociais da escola' },
  { icon: Megaphone, label: 'Marketing', prompt: 'Quais estratégias de marketing funcionam para escolas de música?' },
  { icon: HelpCircle, label: 'Pedagogia', prompt: 'Dicas pedagógicas para ensinar crianças iniciantes em música' },
];

export function QuickPrompts({ onSelect, className }: QuickPromptsProps) {
  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-1 scrollbar-hide", className)}>
      {quickPrompts.map((item) => (
        <button
          key={item.label}
          onClick={() => onSelect(item.prompt)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/80 hover:bg-secondary text-secondary-foreground text-xs font-medium whitespace-nowrap transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-border/30"
        >
          <item.icon className="w-3.5 h-3.5 text-primary/70" />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
