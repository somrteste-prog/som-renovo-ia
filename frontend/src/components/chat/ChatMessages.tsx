import { useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { Music, Sparkles } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  onSuggestionClick?: (suggestion: string) => void;
}

const suggestions = [
  'Como atender um cliente difícil?',
  'Ideias criativas para redes sociais',
  'Dicas pedagógicas para iniciantes',
  'Estratégias para reter alunos',
];

export function ChatMessages({ messages, isLoading, onSuggestionClick }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="text-center max-w-md animate-fade-in space-y-6">
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 animate-pulse-slow" />
            <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center border border-primary/10">
              <Music className="w-10 h-10 text-primary" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-primary/60 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Olá! Sou o Som Renovo IA</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Estou aqui para ajudar a equipe da Som Renovo em atendimento, 
              pedagogia, marketing, criatividade e decisões do dia a dia.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground/70 font-medium uppercase tracking-wider">
              Sugestões para começar
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => onSuggestionClick?.(s)}
                  className="text-xs px-4 py-2 rounded-xl bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground transition-all duration-200 border border-border/50 hover:border-primary/30 hover:shadow-sm active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {isLoading && <TypingIndicator status="typing" />}
      <div ref={bottomRef} className="h-1" />
    </div>
  );
}
