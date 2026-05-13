"use client";

interface StepperProps {
  steps: string[];
  activeStep: number;
}

export function Stepper({ steps, activeStep }: StepperProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        {steps.map((title, index) => {
          const completed = index < activeStep;
          const active = index === activeStep;
          const baseClasses =
            "h-10 w-10 mx-auto flex items-center justify-center rounded-full border text-sm font-semibold ";
          const variantClasses = completed
            ? "bg-sky-600 border-sky-600 text-white"
            : active
            ? "bg-white border-sky-600 text-sky-600"
            : "bg-white border-slate-300 text-slate-500";

          return (
            <div key={title} className="flex-1">
              <div className={baseClasses + variantClasses}>{index + 1}</div>
              <p className="mt-2 text-center text-xs text-slate-600">{title}</p>
            </div>
          );
        })}
      </div>
      <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-sky-600" style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} />
      </div>
    </div>
  );
}
