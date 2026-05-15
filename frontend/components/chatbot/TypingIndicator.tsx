export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-3xl bg-white px-4 py-3 shadow-sm dark:bg-slate-800">
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></span>
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.2s]"></span>
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0.4s]"></span>
      </div>
    </div>
  );
}