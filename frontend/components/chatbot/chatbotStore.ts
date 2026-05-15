"use client";

import { create } from "zustand";

interface Message {
  role: "user" | "bot";
  content: string;
}

interface ChatbotState {
  isOpen: boolean;
  loading: boolean;
  messages: Message[];

  toggleChat: () => void;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
}

export const useChatbotStore = create<ChatbotState>((set) => ({
  isOpen: false,
  loading: false,

  messages: [
    {
      role: "bot",
      content: "Hello 👋 How can I help you today?",
    },
  ],

  toggleChat: () =>
    set((state) => ({
      isOpen: !state.isOpen,
    })),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setLoading: (loading) => set({ loading }),
}));