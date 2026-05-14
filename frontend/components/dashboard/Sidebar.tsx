"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Dashboard", href: "/dashboard", icon: "D" },
  { label: "Datasets", href: "/dashboard/datasets", icon: "DS" },
  { label: "Models", href: "/dashboard/models", icon: "M" },
  { label: "About Project", href: "/dashboard/about", icon: "A" },
  { label: "Usecases", href: "/dashboard/usecases", icon: "U" },
  { label: "Sandbox", href: "/dashboard/sandbox", icon: "S" },
  { label: "Leaderboard", href: "/dashboard/leaderboard", icon: "L" },
  { label: "Challenges", href: "/dashboard/challenges", icon: "C" },
  { label: "Discussions", href: "/dashboard/discussions", icon: "D" },
  { label: "Resources", href: "/dashboard/resources", icon: "R" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`h-screen flex flex-col justify-between overflow-y-auto border border-slate-200 bg-white p-5 shadow-sm ${
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
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.label} href={item.href} className={`flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-sky-600 text-white shadow-lg"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}>
                <span className={`flex h-10 w-10 items-center justify-center rounded-3xl ${isActive ? "bg-white text-sky-600" : "bg-slate-100 text-slate-500"}`}>
                  {item.icon}
                </span>
                {!collapsed ? item.label : null}
              </Link>
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
