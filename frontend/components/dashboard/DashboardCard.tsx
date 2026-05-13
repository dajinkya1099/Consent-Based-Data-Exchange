interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle: string;
}

export function DashboardCard({ title, value, subtitle }: DashboardCardProps) {
  return (
    <div className="group rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">{title}</p>
        <div className="h-11 w-11 rounded-3xl bg-sky-100 text-sky-700 grid place-items-center text-lg font-semibold">{title.charAt(0)}</div>
      </div>
      <p className="mt-6 text-4xl font-semibold text-slate-900">{value}</p>
      <p className="mt-3 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}
