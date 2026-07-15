"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

import { usePathname } from "next/navigation";

export default function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Namaste! I'm Shanthi, your personal styling assistant. How can I help you discover your perfect bespoke look today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message to state
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error("Failed to connect to AI");

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: "I'm having trouble connecting to my network right now. Please try again or reach out on WhatsApp!" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 lg:bottom-6 right-4 md:right-6 z-50 w-14 h-14 bg-[#C9A84C] hover:bg-[#b09341] rounded-full flex items-center justify-center shadow-2xl shadow-[#C9A84C]/20 transition-colors"
          >
            <MessageCircle className="text-black w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-[110px] lg:bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-32px)] md:w-[350px] sm:w-[380px] h-[550px] max-h-[75vh] bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#111] border-b border-white/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C9A84C] to-[#ffe599] flex items-center justify-center">
                  <span className="text-black font-serif font-bold text-sm">S</span>
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">Shanthi Assistant</h3>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider">AI Stylist</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div 
                    className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                      msg.role === "user" 
                        ? "bg-[#C9A84C] text-black rounded-tr-sm" 
                        : "bg-[#1A1A1A] text-white/90 rounded-tl-sm border border-white/5"
                    }`}
                  >
                    <ReactMarkdown 
                      components={{
                        img: ({node, ...props}) => <img {...props} className="rounded-lg max-w-full h-auto my-2 border border-white/10" alt={props.alt || "AI generated image"} />,
                        a: ({node, ...props}) => <a {...props} className="text-[#C9A84C] underline underline-offset-2" target="_blank" rel="noopener noreferrer" />,
                        p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0" />
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl rounded-tl-sm p-4">
                    <Loader2 className="w-4 h-4 text-[#C9A84C] animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#111] border-t border-white/5">
              <form onSubmit={sendMessage} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about fabrics, styles, or booking..."
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 w-8 h-8 flex items-center justify-center bg-[#C9A84C] rounded-full text-black disabled:opacity-50 disabled:bg-white/10 disabled:text-white/30 transition-colors"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
