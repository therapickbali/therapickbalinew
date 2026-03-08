
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWellnessRecommendation } from '../services/geminiService';
import { ChatMessage, ServiceRecommendation } from '../types';
import { WHATSAPP_NUMBER, SERVICES, parseServiceOptions, formatPrice } from '../constants';
import { useChat } from '../context/ChatContext';
import { useLocation } from 'react-router-dom';

const ChatBot: React.FC = () => {
  const { isOpen, closeChat, openChat, initialMessage, clearInitialMessage } = useChat();
  const location = useLocation();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) setMessages([{ id: '1', role: 'model', text: "Welcome to Elexoir. How can I assist you today?" }]);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    const responseMsg = await getWellnessRecommendation(input, location.pathname);
    setMessages(prev => [...prev, responseMsg]);
    setIsLoading(false);
  };

  return (
    <>
      <motion.button
        onClick={() => openChat()}
        className={`fixed bottom-6 right-6 z-40 bg-black text-white p-4 rounded-full shadow-2xl hover:bg-primary transition-colors ${isOpen ? 'hidden' : 'block'}`}
      >
        <Sparkles className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50 w-full md:w-96 bg-white border border-gray-100 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col h-[600px] max-h-[85vh]"
          >
            <div className="bg-white p-5 flex justify-between items-center border-b border-gray-100">
              <span className="font-serif text-black font-light text-2xl tracking-tight">Concierge<span className="text-primary italic">.</span></span>
              <button onClick={closeChat} className="text-gray-400 hover:text-black p-2 bg-gray-50 rounded-full transition-colors"><X className="h-4 w-4" strokeWidth={1.5} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#F9F9F6]">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-4 text-sm font-light leading-relaxed rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white shadow-md rounded-tr-sm' : 'bg-white text-gray-700 border border-gray-100 shadow-sm rounded-tl-sm'}`}>
                        {msg.text}
                    </div>
                </div>
              ))}
              {isLoading && <div className="text-gray-400 text-[9px] px-4 font-sans font-semibold uppercase tracking-[0.3em]">Typing...</div>}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-100 flex gap-3">
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about our rituals..."
                    className="flex-1 bg-gray-50 rounded-xl border border-gray-100 px-5 py-3 text-sm font-light text-black focus:border-black outline-none transition-colors"
                />
                <button onClick={handleSend} className="bg-black text-white p-3 rounded-xl hover:bg-primary transition-colors flex items-center justify-center">
                    <Send className="w-4 h-4" strokeWidth={1.5} />
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
