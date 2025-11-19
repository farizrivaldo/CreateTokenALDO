import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User, AlertCircle } from 'lucide-react';
import { getGroqApiKey, GROQ_API_URL, GROQ_MODEL } from '../utils/apiConfig';

const API_KEY = getGroqApiKey();
const API_URL = GROQ_API_URL;
const MODEL = GROQ_MODEL;

// ... rest sama

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Halo! Saya asisten AI Anda. Ada yang bisa saya bantu?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    if (!API_KEY) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Error: API Key tidak ditemukan. Pastikan REACT_APP_GROQ_API_KEY sudah di-set di file .env dan restart development server.'
        }
      ]);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            ...messages,
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = data.choices?.[0]?.message?.content || 'Tidak ada respons dari AI';

      setMessages(prev => [...prev, { role: 'assistant', content: aiMessage }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Maaf, terjadi kesalahan: ${error.message}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Halo! Saya asisten AI Anda. Ada yang bisa saya bantu?'
      }
    ]);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-50"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-700/50">
          <div className="bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Assistant</h3>
                <p className="text-white/80 text-xs">
                  {API_KEY ? 'Online' : 'API Key Missing'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearChat}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                title="Clear chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors hover:bg-white/10 rounded-lg p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!API_KEY && (
            <div className="bg-yellow-500/20 border-l-4 border-yellow-500 p-3 mx-4 mt-4 rounded">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <div className="text-sm text-yellow-200">
                  <p className="font-semibold">API Key tidak ditemukan!</p>
                  <p className="text-xs mt-1">Pastikan file .env sudah dibuat dan restart server.</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50 backdrop-blur-sm">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="bg-purple-600/80 backdrop-blur-sm p-2 rounded-lg h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600/80 to-blue-600/80 backdrop-blur-sm text-white rounded-br-none shadow-lg'
                      : 'bg-slate-800/80 backdrop-blur-sm text-gray-100 rounded-bl-none border border-slate-700/50 shadow-lg'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="bg-blue-600/80 backdrop-blur-sm p-2 rounded-lg h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="bg-purple-600/80 backdrop-blur-sm p-2 rounded-lg h-8 w-8 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-800/80 backdrop-blur-sm text-gray-100 p-3 rounded-2xl rounded-bl-none border border-slate-700/50 shadow-lg">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-slate-900/80 backdrop-blur-sm rounded-b-2xl border-t border-slate-700/50">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ketik pesan..."
                className="flex-1 bg-slate-800/60 backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-slate-700/50 focus:outline-none focus:border-purple-500/50 focus:bg-slate-800/80 transition-all placeholder:text-gray-500"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-purple-600/80 to-blue-600/80 backdrop-blur-sm text-white p-2 rounded-xl hover:shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;