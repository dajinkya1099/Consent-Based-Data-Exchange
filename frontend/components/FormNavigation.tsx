"use client";

interface FormNavigationProps {
  step: number;
  maxStep: number;
  onBack: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  submitLabel?: string;
}

export function FormNavigation({ step, maxStep, onBack, onNext, isNextDisabled, submitLabel }: FormNavigationProps) {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onBack}
        disabled={step === 0}
        className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={isNextDisabled}
        className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitLabel || (step === maxStep ? "Submit" : "Next")}
      </button>
    </div>
  );
}
