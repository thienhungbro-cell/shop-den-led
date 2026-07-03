"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, X, Send, Loader2, PhoneCall } from "lucide-react";

function GeminiIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2c0 5.523 4.477 10 10 10c-5.523 0-10 4.477-10 10c0-5.523-4.477-10-10-10c5.523 0 10-4.477 10-10z"
        fill="url(#gemini-gradient)"
      />
      <defs>
        <linearGradient id="gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a88f7" />
          <stop offset="35%" stopColor="#8d62f3" />
          <stop offset="70%" stopColor="#e55490" />
          <stop offset="100%" stopColor="#f38b70" />
        </linearGradient>
      </defs>
    </svg>
  );
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_REPLIES = [
  "Tư vấn bi cầu cho Winner X",
  "Địa chỉ shop ở đâu?",
  "Chính sách bảo hành thế nào?",
  "Tư vấn mạch tắt đèn xe",
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupActive, setIsPopupActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Xin chào! Em là Trợ lý ảo AI của Xuân Lợi Store. 💡 Em có thể giúp anh/chị tư vấn chọn đèn bi cầu, đèn trợ sáng, các loại mạch điện thông minh hoặc giải đáp các thắc mắc về lắp đặt và bảo hành ạ!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Listen to the consultation popup active state to prevent overlap
  useEffect(() => {
    const handlePopupActive = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsPopupActive(!!customEvent.detail);
    };

    window.addEventListener("consultation-popup-active", handlePopupActive);
    return () => {
      window.removeEventListener("consultation-popup-active", handlePopupActive);
    };
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && chatInputRef.current) {
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Rất tiếc, hệ thống gặp lỗi kết nối với trợ lý ảo. Anh/chị có thể liên hệ trực tiếp Zalo 0359.663.118 để được hỗ trợ ngay ạ!",
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Đã xảy ra lỗi kết nối. Anh/chị vui lòng thử lại sau hoặc liên hệ Hotline: 0359.663.118.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  // If the consultation popup is currently active on screen, hide the chatbot button to avoid overlap
  if (isPopupActive && !isOpen) return null;

  return (
    <div className="fixed bottom-18 left-4 sm:bottom-6 sm:left-6 z-50">
      {/* Chatbot Button */}
      {!isOpen && (
        <div className="relative">
          {/* Inner container with overflow-hidden for the rotating border */}
          <div className="group relative flex items-center justify-center overflow-hidden rounded-full p-[2.5px] shadow-[0_0_15px_rgba(59,130,246,0.35)] hover:scale-105 active:scale-95 transition-all duration-300">
            <div
              className="absolute w-[200px] h-[200px] left-1/2 top-1/2 -ml-[100px] -mt-[100px] animate-[spin_4s_linear_infinite] pointer-events-none"
              style={{
                backgroundImage: "conic-gradient(from 0deg, #3b82f6, #06b6d4, #6366f1, #3b82f6)",
              }}
            />
            
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-2 h-11 px-4 bg-white text-gray-800 rounded-full w-full justify-center cursor-pointer"
              aria-label="Mở trợ lý ảo Gemini tư vấn"
            >
              <GeminiIcon size={22} className="animate-pulse shrink-0" />
              <span className="text-xs sm:text-sm font-extrabold text-gray-900 pr-1 select-none">Gemini tư vấn</span>
            </button>
          </div>

          {/* Blue Notification Dot - Placed outside overflow-hidden */}
          <span className="absolute inline-flex h-3.5 w-3.5 rounded-full bg-blue-500 opacity-75 animate-ping -top-1 -right-1 z-10 pointer-events-none" />
          <span className="absolute inline-flex h-3.5 w-3.5 rounded-full bg-blue-500 -top-1 -right-1 z-10 pointer-events-none" />
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] max-h-[80vh] flex flex-col rounded-2xl border border-gray-200 bg-white text-gray-800 shadow-2xl overflow-hidden animate-[slide-in_0.3s_ease-out_forwards]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="relative p-1 bg-gray-100 rounded-xl">
                <GeminiIcon size={24} />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1">
                  Trợ lý Gemini AI
                </h4>
                <p className="text-[10px] text-gray-500">Tự động trả lời 24/7</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-200">
            {messages.map((msg, idx) => {
              const isAi = msg.role === "assistant";
              return (
                <div
                  key={idx}
                  className={`flex ${isAi ? "justify-start" : "justify-end"} animate-[slide-in_0.2s_ease-out_forwards]`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                      isAi
                        ? "bg-white border border-gray-200 text-gray-850 rounded-tl-xs shadow-xs"
                        : "bg-gradient-to-r from-primary to-primary-dark text-white rounded-tr-xs shadow-xs"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-xs px-4 py-3 flex gap-1.5 items-center shadow-xs">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && !isLoading && (
            <div className="px-4 py-2 bg-gray-50/80 gap-1.5 flex flex-wrap border-t border-gray-100">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleSendMessage(reply)}
                  className="text-left text-xs bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Form Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center"
          >
            <input
              ref={chatInputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              disabled={isLoading}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-450 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              aria-label="Gửi tin nhắn"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </form>

          {/* Contact Hotline bar inside chat */}
          <div className="bg-gray-50 px-4 py-1.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500 shrink-0">
            <span>Xuân Lợi Store: 0359.663.118</span>
            <a
              href="tel:0359663118"
              className="text-primary hover:underline flex items-center gap-1 font-semibold"
            >
              <PhoneCall size={10} /> Gọi ngay
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
