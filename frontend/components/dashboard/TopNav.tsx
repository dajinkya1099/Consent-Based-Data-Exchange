"use client";

import { useState } from "react";

interface TopNavProps {
  onProfileClick: () => void;
}

export function TopNav({ onProfileClick }: TopNavProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-white px-6 py-5 shadow-sm transition duration-300 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-3xl bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Overview</div>
          <h1 className="text-2xl font-semibold text-slate-900">Enterprise Dashboard</h1>
        </div>
        <p className="max-w-2xl text-sm text-slate-500">Monitor performance, datasets, and consent activity across the platform with real-time insights.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:border-slate-300 hover:bg-slate-100">
          <span className="text-lg">🔔</span>
          <span>Notifications</span>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-xs font-semibold text-white">3</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu((value) => !value)}
            className="inline-flex items-center gap-3 rounded-3xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-slate-800"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-950">P</span>
            <span>Profile</span>
          </button>
          {showMenu ? (
            <div className="absolute right-0 top-full mt-3 w-56 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
              <button type="button" onClick={onProfileClick} className="w-full rounded-3xl px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100">
                View profile
              </button>
              <button type="button" className="mt-2 w-full rounded-3xl px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100">
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
