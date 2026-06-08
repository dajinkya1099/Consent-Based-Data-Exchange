import { InputFieldProps } from "../types";

export default function InputField({
  label,
  name,
  type = "text",
  value,
  placeholder,
  required = false,
  error,
  onChange,
}: InputFieldProps) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      <span className="flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 transition focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 ${
          error ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100" : ""
        }`}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </label>
  );
}
