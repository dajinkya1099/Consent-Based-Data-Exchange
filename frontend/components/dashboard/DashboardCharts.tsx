"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const usageTrend = [
  { name: "Jan", value: 32 },
  { name: "Feb", value: 45 },
  { name: "Mar", value: 38 },
  { name: "Apr", value: 55 },
  { name: "May", value: 62 },
  { name: "Jun", value: 71 },
];

const datasetBreakdown = [
  { name: "Health", value: 35 },
  { name: "Finance", value: 25 },
  { name: "Education", value: 20 },
  { name: "Government", value: 20 },
];

export function DashboardCharts() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Activity Trend</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">Consent Requests</p>
          </div>
          <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Monthly growth +12%</div>
        </div>
        <div className="mt-8 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={usageTrend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 24, border: "none", boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)" }} />
              <Area type="monotone" dataKey="value" stroke="#0ea5e9" fill="url(#colorUsage)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Dataset Breakdown</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">Top Categories</p>
        </div>
        <div className="mt-8 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={datasetBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} fill="#0ea5e9" label />
              <Tooltip contentStyle={{ borderRadius: 24, border: "none", boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
