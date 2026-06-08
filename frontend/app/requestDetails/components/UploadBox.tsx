import type { DragEvent } from "react";
import { UploadBoxProps } from "../types";

export default function UploadBox({ fileName, error, onFileChange }: UploadBoxProps) {
  const handleFile = (file: File | null) => {
    onFileChange(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] ?? null;
    handleFile(file);
  };

  return (
    <label className="block text-sm font-medium text-slate-700">
      <span className="flex items-center gap-1">
        Upload PDF
        <span className="text-red-500">*</span>
      </span>
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className={`relative mt-3 flex min-h-[200px] w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-8 text-center transition ${
          error
            ? "border-red-300 bg-red-50"
            : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-white"
        }`}
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <div className="pointer-events-none" />
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl text-slate-500">
          ⬆️
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-slate-900">Upload a PDF</p>
          <p className="text-sm text-slate-500">Drag and drop or click to select a file</p>
        </div>
        <div className="mt-4 text-sm text-slate-500">
          {fileName ? <span className="font-medium text-slate-900">{fileName}</span> : "PDF file format only"}
        </div>
      </div>
      {error ? <p className="mt-3 text-xs text-red-600">{error}</p> : null}
    </label>
  );
}
