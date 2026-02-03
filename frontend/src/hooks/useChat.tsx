import { useState, useCallback } from 'react';
import { Message, UserContext, WebhookPayload, WebhookResponse } from '@/types/chat';

// URL do webhook oficial no backend
const WEBHOOK_URL =
  import.meta.env.VITE_WEBHOOK_URL || 'http://localhost:3000/api/chat';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string, userContext: UserContext, additionalContext?: string) => {
      if (!content.trim()) return;

      // 1️⃣ Mensagem do usuário
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        // 2️⃣ Payload para o backend
        const payload: WebhookPayload = {
          mensagem: content.trim(),
          nome_usuario: userContext.name,
          setor: userContext.sector,
          contexto_cliente: additionalContext || userContext.additionalContext,
        };

        // 3️⃣ Chamada ao backend
        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Erro ao conectar com o servidor');
        }

        const data = await response.json();

        // 🔒 Blindagem total da resposta
        const assistantContent =
          typeof data.reply === 'string'
            ? data.reply
            : typeof data.resposta === 'string'
            ? data.resposta
            : 'Não consegui gerar uma resposta agora.';

        // 4️⃣ Mensagem do assistente
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: assistantContent,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');

        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 5️⃣ Limpar mensagens
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}