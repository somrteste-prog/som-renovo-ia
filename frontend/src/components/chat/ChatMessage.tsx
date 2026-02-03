import { useState } from 'react';
import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { Check, Copy, Share2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ChatMessageProps {
  message: Message;
  onRetry?: () => void;
}

export function ChatMessage({ message, onRetry }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const isUser = message.role === 'user';

  const safeContent = typeof message.content === 'string'
    ? message.content
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(safeContent);
      setCopied(true);
      toast.success('Copiado para a área de transferência');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Erro ao copiar');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Som Renovo IA',
          text: safeContent,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className={cn(
        "group flex w-full animate-message-in",
        isUser ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onTouchStart={() => setShowActions(true)}
    >
      <div className="flex flex-col max-w-[85%] md:max-w-[75%]">
        <div
          className={cn(
            "relative rounded-2xl px-4 py-3 transition-all duration-200",
            isUser
              ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-lg shadow-lg shadow-primary/20"
              : "bg-card text-card-foreground rounded-bl-lg border border-border/50 shadow-sm hover:shadow-md"
          )}
        >
          <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {formatMessage(safeContent)}
          </div>

          <div
            className={cn(
              "text-[10px] mt-2 opacity-50 transition-opacity",
              isUser ? "text-right" : "text-left"
            )}
          >
            {formatTime(message.timestamp)}
          </div>

          {isUser && (
            <div className="absolute inset-0 rounded-2xl rounded-br-lg bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
          )}
        </div>

        {!isUser && (
          <div
            className={cn(
              "flex items-center gap-1 mt-1.5 ml-1 transition-all duration-200",
              showActions
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-1 pointer-events-none"
            )}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-muted/80"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span className="text-xs ml-1">
                {copied ? 'Copiado' : 'Copiar'}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-muted/80"
              onClick={handleShare}
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="text-xs ml-1">Compartilhar</span>
            </Button>

            {onRetry && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                onClick={onRetry}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="text-xs ml-1">Refazer</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatMessage(content?: string): React.ReactNode {
  if (!content || typeof content !== 'string') {
    return <span className="opacity-60">...</span>;
  }

  const parts = content.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="bg-muted/80 px-1.5 py-0.5 rounded text-sm font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}