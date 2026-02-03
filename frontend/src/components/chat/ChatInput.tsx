import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { QuickPrompts } from './QuickPrompts';

interface ChatInputProps {
  onSend: (message: string, context?: string) => void;
  isLoading: boolean;
  placeholder?: string;
  showQuickPrompts?: boolean;
}

export function ChatInput({ onSend, isLoading, placeholder, showQuickPrompts = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [context, setContext] = useState('');
  const [showContext, setShowContext] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim(), context.trim() || undefined);
      setMessage('');
      setContext('');
      setShowContext(false);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessage(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="border-t border-border/50 bg-gradient-to-t from-background via-background to-background/95 backdrop-blur-xl p-3 md:p-4 space-y-3">
      {showQuickPrompts && !message && (
        <QuickPrompts onSelect={handleQuickPrompt} className="animate-fade-in" />
      )}

      {showContext && (
        <div className="animate-slide-up bg-muted/50 rounded-xl p-3 border border-border/30">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-muted-foreground">
              Contexto adicional
            </label>
            <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => { setShowContext(false); setContext(''); }}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Adicione contexto sobre o cliente ou situação..."
            className="min-h-[60px] text-sm resize-none bg-background/50 border-border/30 focus:border-primary/30"
          />
        </div>
      )}

      <div className="flex items-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "shrink-0 h-11 w-11 rounded-xl transition-all duration-200",
            showContext 
              ? "bg-primary/10 text-primary hover:bg-primary/20" 
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setShowContext(!showContext)}
          title="Adicionar contexto"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Digite sua pergunta..."}
            disabled={isLoading}
            className={cn(
              "min-h-[44px] max-h-[150px] py-3 px-4 pr-12 resize-none text-sm md:text-base",
              "bg-muted/50 hover:bg-muted/70 focus:bg-background",
              "rounded-2xl border-border/30 focus:border-primary/30",
              "transition-all duration-200 placeholder:text-muted-foreground/70"
            )}
            rows={1}
          />
          {message.length > 200 && (
            <span className="absolute right-14 bottom-3 text-[10px] text-muted-foreground">
              {message.length}
            </span>
          )}
        </div>

        <Button
          type="button"
          size="icon"
          className={cn(
            "shrink-0 h-11 w-11 rounded-xl transition-all duration-200",
            message.trim() && !isLoading
              ? "som-gradient shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 active:scale-95"
              : "bg-muted text-muted-foreground"
          )}
          onClick={handleSubmit}
          disabled={!message.trim() || isLoading}
        >
          <Send className={cn(
            "h-5 w-5 transition-transform duration-200",
            message.trim() && !isLoading && "translate-x-0.5 -translate-y-0.5"
          )} />
        </Button>
      </div>

      <p className="text-[10px] text-muted-foreground/60 text-center">
        Som Renovo IA — Ajudando a equipe a tomar decisões melhores
      </p>
    </div>
  );
}
