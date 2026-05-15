"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Dashboard", href: "/dashboard"},
  { label: "Datasets", href: "/dashboard/datasets"},
  { label: "Models", href: "/dashboard/models"},
  { label: "About Project", href: "/dashboard/about"},
  { label: "Usecases", href: "/dashboard/usecases"},
  { label: "Sandbox", href: "/dashboard/sandbox"},
  { label: "Leaderboard", href: "/dashboard/leaderboard"},
  { label: "Challenges", href: "/dashboard/challenges"},
  { label: "Discussions", href: "/dashboard/discussions"},
  { label: "Resources", href: "/dashboard/resources"},
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
            const isActive = item.href === "/dashboard"? pathname === "/dashboard": pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.label} href={item.href} className={`flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "rounded-3xl bg-blue-900 border border-slate-400/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-200 hover:text-slate-900"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}>
               
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
