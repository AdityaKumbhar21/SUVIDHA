import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageSquare, User, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Namaste! I am Suvidha AI. How can I help you with government services today?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add User Message
    const newMsg = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, newMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI Response (Mock Logic)
    setTimeout(() => {
      let botResponse = "I can help you navigate the portal. Please select a service from the Dashboard.";
      
      const lowerInput = newMsg.text.toLowerCase();
      if (lowerInput.includes("bill") || lowerInput.includes("pay")) botResponse = "To pay bills, please go to the 'Services' menu and select Electricity or Water department.";
      if (lowerInput.includes("document") || lowerInput.includes("aadhar")) botResponse = "You can upload documents in the 'Applications' section after logging in.";
      if (lowerInput.includes("hindi")) botResponse = "आप ऊपर दाएं कोने में बटन पर क्लिक करके भाषा बदल सकते हैं।";

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 right-8 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden font-sans"
        >
          {/* Header */}
          <div className="bg-[#1e3a8a] p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Suvidha Sahayak</h3>
                <p className="text-[10px] text-blue-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition">
              <X size={18} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="h-80 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm font-medium shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-[#1e3a8a] text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your query here..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            />
            <button 
              onClick={handleSend}
              className="bg-[#1e3a8a] text-white p-2.5 rounded-full hover:bg-blue-900 transition-colors shadow-lg active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWidget;