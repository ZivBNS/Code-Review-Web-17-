import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIChat({ messages, onSendMessage, selectedLine, activeFile }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {selectedLine && activeFile && (
        <div className="p-3 bg-blue-500/10 border-b border-blue-500/20 text-xs flex items-center gap-2 text-blue-400">
          <Code2 className="w-4 h-4" />
          <span>Discussing <strong>{activeFile}</strong> : Line {selectedLine}</span>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 \${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 \${msg.role === 'user' ? 'bg-purple-500/20 text-purple-500' : 'bg-blue-500/20 text-blue-500'}`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className={`flex flex-col max-w-[75%] \${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-3 rounded-2xl text-sm \${msg.role === 'user' ? 'bg-purple-600 text-white rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'}`}>
                {msg.content}
              </div>
              {msg.contextLine && (
                <div className="text-[10px] text-muted-foreground mt-1 px-1">
                  Line {msg.contextLine}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border bg-card">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedLine ? `Ask about line \${selectedLine}...` : "Ask a question..."}
            className="w-full bg-muted border border-border text-foreground rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
