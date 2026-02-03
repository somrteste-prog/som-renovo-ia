import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  status?: 'typing' | 'processing';
}

export function TypingIndicator({ status = 'typing' }: TypingIndicatorProps) {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="bg-card border border-border/50 rounded-2xl rounded-bl-lg px-4 py-3.5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary/70 animate-typing-dot" />
            <div className="w-2 h-2 rounded-full bg-primary/70 animate-typing-dot-delay-1" />
            <div className="w-2 h-2 rounded-full bg-primary/70 animate-typing-dot-delay-2" />
          </div>
          <span className={cn("text-xs text-muted-foreground ml-1 animate-pulse", status === 'processing' && "text-primary/70")}>
            {status === 'typing' ? 'Som Renovo IA está digitando...' : 'Processando resposta...'}
          </span>
        </div>
      </div>
    </div>
  );
}
