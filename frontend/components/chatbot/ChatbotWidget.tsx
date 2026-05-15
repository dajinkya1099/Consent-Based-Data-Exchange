"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import { useChatbotStore } from "./chatbotStore";

export default function ChatbotWidget() {
  const {
    isOpen,
    toggleChat,
    messages,
    addMessage,
    loading,
    setLoading,
  } = useChatbotStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Send message
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    addMessage({
      role: "user",
      content: message,
    });

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8000/api/chatbot/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message,
  }),
});

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();

      // Add bot response
      addMessage({
        role: "bot",
        content:
          data.reply ||
          "I couldn't process your request.",
      });
    } catch (error) {
      addMessage({
        role: "bot",
        content:
          "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-blue-900 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-blue-800"
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <MessageCircle size={28} />
        )}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 40,
              scale: 0.95,
            }}
            transition={{
              duration: 0.25,
            }}
            className="fixed bottom-28 right-6 z-50 flex h-[650px] w-[380px] flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-br from-slate-800 via-blue-800 to-slate-700 px-5 py-4 text-white dark:border-slate-700">
              <div>
                <h2 className="text-lg font-semibold">
                  AI Assistant
                </h2>

                <p className="text-xs opacity-80">
                  Always online
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-300"></div>

                <span className="text-xs">
                  Active
                </span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-5 dark:bg-slate-950">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                />
              ))}

              {/* Typing Loader */}
              {loading && <TypingIndicator />}

              {/* Auto Scroll Ref */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput
              onSend={sendMessage}
              loading={loading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}