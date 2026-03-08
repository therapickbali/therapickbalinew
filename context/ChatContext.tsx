import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatContextType {
  isOpen: boolean;
  openChat: (initialMsg?: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
  initialMessage: string | null;
  clearInitialMessage: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string | null>(null);

  const openChat = (initialMsg?: any) => {
    if (typeof initialMsg === 'string') {
      setInitialMessage(initialMsg);
    }
    setIsOpen(true);
  };

  const closeChat = () => setIsOpen(false);
  const toggleChat = () => setIsOpen(prev => !prev);
  const clearInitialMessage = () => setInitialMessage(null);

  return (
    <ChatContext.Provider value={{ isOpen, openChat, closeChat, toggleChat, initialMessage, clearInitialMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};