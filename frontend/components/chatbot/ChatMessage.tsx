interface ChatMessageProps {
  role: "user" | "bot";
  content: string;
}

export default function ChatMessage({
  role,
  content,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm shadow-sm ${
          isUser
            ? "bg-blue-900 text-white"
            : "bg-white text-slate-800 dark:bg-slate-800 dark:text-white"
        }`}
      >
        {content}
      </div>
    </div>
  );
}