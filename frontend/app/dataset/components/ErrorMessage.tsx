interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex min-h-[360px] items-center justify-center">
      <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-red-800">Unable to load datasets</h2>
        <p className="mt-2 text-sm text-red-700">{message}</p>
      </div>
    </div>
  );
}
