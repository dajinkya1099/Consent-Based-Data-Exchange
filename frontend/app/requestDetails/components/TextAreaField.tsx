import { TextAreaFieldProps } from "../types";

export default function TextAreaField({
  label,
  name,
  value,
  placeholder,
  maxLength,
  error,
  onChange,
}: TextAreaFieldProps) {
  return (
    <label className="space-y-3 text-sm font-medium text-slate-700">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1">
          {label}
          <span className="text-red-500">*</span>
        </span>
        <span className="text-xs text-slate-400">{value.length}/{maxLength}</span>
      </div>
      <textarea
        name={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={6}
        className={`min-h-[160px] w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 transition focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 ${
          error ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100" : ""
        }`}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </label>
  );
}
