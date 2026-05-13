"use client";

import { useState } from "react";

const links = [
  { label: "Dashboard", href: "/dashboard", icon: "D" },
  { label: "Datasets", href: "/dashboard", icon: "DS" },
  { label: "Models", href: "/dashboard", icon: "M" },
  { label: "About", href: "/dashboard", icon: "A" },
  { label: "Contact Us", href: "/dashboard", icon: "C" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [active, setActive] = useState("Dashboard");

  return (
    <aside
      className={`flex h-full flex-col justify-between rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div>
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-xl font-semibold text-white shadow-sm">
            C
          </div>
          {!collapsed ? (
            <div>
              <p className="text-sm font-semibold text-slate-900">ConsentX</p>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Data Exchange</p>
            </div>
          ) : null}
        </div>

        <nav className="space-y-2">
          {links.map((item) => {
            const isActive = active === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setActive(item.label)}
                className={`flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-sky-600 text-white shadow-lg"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-3xl ${isActive ? "bg-white text-sky-600" : "bg-slate-100 text-slate-500"}`}>
                  {item.icon}
                </span>
                {!collapsed ? item.label : null}
              </button>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className="mt-6 inline-flex w-full items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:border-slate-300 hover:bg-slate-100"
      >
        {collapsed ? "Open Menu" : "Collapse Sidebar"}
      </button>
    </aside>
  );
}
