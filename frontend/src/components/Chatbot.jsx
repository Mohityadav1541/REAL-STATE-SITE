import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am the SS Developers AI assistant. How can I help you find the perfect industrial plot or facility?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post(`${API_BASE}/chat`, {
        message: userMsg.content,
        history: messages.slice(-5) // Send last 5 messages for context
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting to the server right now. Please try again later or contact our team directly.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: '90px',
              right: '20px',
              width: '350px',
              height: '500px',
              backgroundColor: '#fff',
              borderRadius: '24px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 9999,
              overflow: 'hidden',
              border: '1px solid var(--color-border)'
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px', backgroundColor: 'var(--color-primary)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>SS Dev Assistant</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#f9f9f9' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: '12px', alignItems: 'flex-end' }}>
                  <div style={{ width: '28px', height: '28px', backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : '#e5e5e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {msg.role === 'user' ? <User size={14} color="#fff" /> : <Bot size={14} color="#333" />}
                  </div>
                  <div style={{ 
                    backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : '#fff',
                    color: msg.role === 'user' ? '#fff' : '#333',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                    borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px',
                    fontSize: '14px',
                    lineHeight: 1.5,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    maxWidth: '80%'
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                  <div style={{ width: '28px', height: '28px', backgroundColor: '#e5e5e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={14} color="#333" />
                  </div>
                  <div style={{ backgroundColor: '#fff', padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: 6, height: 6, backgroundColor: '#999', borderRadius: '50%' }} />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: 6, height: 6, backgroundColor: '#999', borderRadius: '50%' }} />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: 6, height: 6, backgroundColor: '#999', borderRadius: '50%' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} style={{ padding: '16px', backgroundColor: '#fff', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '12px' }}>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid #ddd', outline: 'none', fontSize: '14px', backgroundColor: '#f5f5f5' }}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: input.trim() && !isTyping ? 'var(--color-primary)' : '#e5e5e5', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !isTyping ? 'pointer' : 'default', transition: 'background-color 0.2s' }}
              >
                {isTyping ? <Loader2 size={18} className="spin" /> : <Send size={18} style={{ transform: 'translateX(-1px) translateY(1px)' }} />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)',
          color: '#fff',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10000
        }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
