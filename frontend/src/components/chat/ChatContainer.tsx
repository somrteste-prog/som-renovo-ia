import { useState, useEffect, useCallback } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { useChat } from '@/hooks/useChat';
import { UserContext } from '@/types/chat';
import { LoginScreen } from '@/components/auth/LoginScreen';
import logo from '@/assets/logo.jpeg';

interface AuthUser {
  email: string;
  name: string;
  sector: string;
  loggedInAt: string;
}

const DEFAULT_CONTEXT: UserContext = { name: '', sector: '' };

export function ChatContainer() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('somRenovoAuthUser');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  const [userContext, setUserContext] = useState<UserContext>(() => {
    const saved = localStorage.getItem('somRenovoUserContext');
    if (saved) {
      try { return JSON.parse(saved); } catch { return DEFAULT_CONTEXT; }
    }
    return DEFAULT_CONTEXT;
  });

  const { messages, isLoading, sendMessage, clearMessages } = useChat();

  useEffect(() => {
    if (authUser) localStorage.setItem('somRenovoAuthUser', JSON.stringify(authUser));
    else localStorage.removeItem('somRenovoAuthUser');
  }, [authUser]);

  useEffect(() => {
    localStorage.setItem('somRenovoUserContext', JSON.stringify(userContext));
  }, [userContext]);

  const handleLogin = (email: string, name: string, sector: string) => {
    const user: AuthUser = { email, name, sector, loggedInAt: new Date().toISOString() };
    setAuthUser(user);
    setUserContext({ name, sector });
  };

  const handleLogout = () => {
    setAuthUser(null);
    clearMessages();
  };

  const handleSendMessage = useCallback((message: string, additionalContext?: string) => {
    sendMessage(message, userContext, additionalContext);
  }, [sendMessage, userContext]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    handleSendMessage(suggestion);
  }, [handleSendMessage]);

  if (!authUser) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="relative flex flex-col h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" aria-hidden="true">
        <img src={logo} alt="" className="w-[50%] max-w-[350px] opacity-[0.02] dark:opacity-[0.03] select-none" draggable={false} />
      </div>

      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/[0.02] to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        <ChatHeader userContext={userContext} onUpdateContext={setUserContext} onClearChat={clearMessages} onLogout={handleLogout} messageCount={messages.length} />
        <ChatMessages messages={messages} isLoading={isLoading} onSuggestionClick={handleSuggestionClick} />
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} showQuickPrompts={messages.length === 0} placeholder={userContext.name ? `${userContext.name}, como posso ajudar?` : 'Digite sua pergunta...'} />
      </div>
    </div>
  );
}
