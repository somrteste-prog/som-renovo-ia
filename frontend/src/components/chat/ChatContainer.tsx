import { useState, useEffect, useCallback } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { useChat } from '@/hooks/useChat';
import { UserContext } from '@/types/chat';
import logo from '@/assets/logo.jpeg';

import { saveUser, removeUser, getCurrentUser } from "@/services/userService";
import { User } from "@/types/user";

const DEFAULT_CONTEXT: UserContext = { name: '', sector: '' };

export function ChatContainer() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userContext, setUserContext] = useState<UserContext>(DEFAULT_CONTEXT);
  const [token, setToken] = useState<string | null>(null); // JWT

  const { messages, isLoading, sendMessage, clearMessages } = useChat();

  // 🔹 Carrega usuário e token salvo ao iniciar
  useEffect(() => {
    async function loadUser() {
      const saved = await getCurrentUser(); // { user, token }
      if (saved) {
        setAuthUser(saved.user);
        setToken(saved.token || null);
        setUserContext({
          name: saved.user.name,
          sector: saved.user.sector || '',
        });
      }
    }
    loadUser();
  }, []);

  // 🔹 Login real via backend
  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erro no login');

      const user: User = data.user;
      const jwtToken: string = data.token;

      await saveUser(user, jwtToken); // salva usuário + token
      setAuthUser(user);
      setToken(jwtToken);
      setUserContext({ name: user.name, sector: user.sector || '' });
    } catch (err) {
      console.error(err);
      alert('Falha no login');
    }
  };

  // 🔹 Logout
  const handleLogout = async () => {
    await removeUser();
    setAuthUser(null);
    setToken(null);
    setUserContext(DEFAULT_CONTEXT);
    clearMessages();
  };

  // 🔹 Envio de mensagem (token separado do additionalContext)
  const handleSendMessage = useCallback(
    (message: string, additionalContext?: string) => {
      sendMessage(message, userContext, additionalContext, token ?? undefined); // 🔹 token enviado corretamente
    },
    [sendMessage, userContext, token]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      handleSendMessage(suggestion);
    },
    [handleSendMessage]
  );

  return (
    <div className="relative flex flex-col h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" aria-hidden="true">
        <img
          src={logo}
          alt=""
          className="w-[50%] max-w-[350px] opacity-[0.02] dark:opacity-[0.03] select-none"
          draggable={false}
        />
      </div>

      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/[0.02] to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        <ChatHeader
          onLogout={handleLogout}
          user={authUser}
        />

        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          onSuggestionClick={handleSuggestionClick}
        />

        <ChatInput
          onSend={handleSendMessage}
          isLoading={isLoading}
          showQuickPrompts={messages.length === 0}
          placeholder={
            userContext.name
              ? `${userContext.name}, como posso ajudar?`
              : 'Digite sua pergunta...'
          }
        />
      </div>
    </div>
  );
}