"use client";

import { Send } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  loading?: boolean;
}

export default function ChatInput({
  onSend,
  loading,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    onSend(message);

    setMessage("");
  };

  return (
    <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <input
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" && handleSend()
          }
          placeholder="Ask something..."
          disabled={loading}
          className="flex-1 rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-900 text-white transition hover:bg-blue-800 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}