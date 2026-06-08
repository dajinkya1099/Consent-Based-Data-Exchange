"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { label: "Dashboard", href: "/dashboard" },

  {
    label: "Dataset Access",
    href: "/get/all-dataset",
    children: [
      { label: "All Datasets", href: "/get/all-dataset" },
      { label: "Request Access", href: "/request-access" },
      { label: "Approved Requests", href: "/get/approved-requests" },
      { label: "Rejected Requests", href: "/get/rejected-requests" },
    ],
  },

  //{ label: "Datasets", href: "/dashboard/datasets" },
  { label: "Models", href: "/dashboard/models" },
  { label: "About Project", href: "/dashboard/about" },
  { label: "Usecases", href: "/dashboard/usecases" },
  { label: "Sandbox", href: "/dashboard/sandbox" },
  { label: "Leaderboard", href: "/dashboard/leaderboard" },
  { label: "Challenges", href: "/dashboard/challenges" },
  { label: "Discussions", href: "/dashboard/discussions" },
  { label: "Resources", href: "/dashboard/resources" },
];

const catalogueLinks = [
  { label: "Owner", href: "/catalogue/owner" },
  { label: "COS", href: "/catalogue/cos" },
  { label: "Resource Server", href: "/catalogue/resource-server" },
  { label: "Provider", href: "/catalogue/provider" },
  { label: "Resource Group", href: "/catalogue/resource-group" },
  { label: "Resource", href: "/catalogue/resource" },
  
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [catalogueOpen, setCatalogueOpen] = useState(true);

  // OPEN/CLOSE STATE
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <aside
      className={`h-screen flex flex-col justify-between overflow-y-auto border border-slate-200 bg-gradient-to-r from-sky-100 to-blue-300 p-5 shadow-sm ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div>
        {/* LOGO */}
        <div className="mb-10 flex items-center gap-3">
          {/* <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-xl font-semibold text-white shadow-sm">
            C
<<<<<<< HEAD
          </div>

          {!collapsed ? (
            <div>
              <p className="text-sm font-semibold text-slate-900">
                ConsentX
              </p>

              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Data Exchange
              </p>
=======
          </div> */}
          {!collapsed ? (
            <div>
              <p className="bg-gradient-to-r from-sky-600 to-blue-800 bg-clip-text text-3xl font-extrabold text-transparent">ConsentX</p>
              {/* <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Data Exchange</p> */}
>>>>>>> 6ad1e91de3843aa6218e0ce0c5bd23937e1d3fd2
            </div>
          ) : null}
        </div>

        {/* MENU */}
        <nav className="space-y-2">
          {links.map((item) => {
<<<<<<< HEAD
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            // DATASET ACCESS WITH DROPDOWN
            if (item.children) {
              return (
                <div key={item.label}>
                  {/* MAIN BUTTON */}
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu(
                        openMenu === item.label ? null : item.label
                      )
                    }
                    className={`flex w-full items-center justify-between rounded-3xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-900 border border-slate-400/30 text-white"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {!collapsed && (
                      <>
                        <span>{item.label}</span>

                        <span>
                          {openMenu === item.label ? "▲" : "▼"}
                        </span>
                      </>
                    )}
                  </button>

                  {/* DROPDOWN OPTIONS */}
                  {!collapsed && openMenu === item.label && (
                    <div className="mt-2 ml-4 space-y-2">
                      {item.children.map((child) => {
                        const isChildActive =
                          pathname === child.href ||
                          pathname.startsWith(`${child.href}/`);

                        return (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={`block rounded-2xl px-4 py-2 text-sm transition ${
                              isChildActive
                                ? "bg-sky-700 text-white"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // NORMAL LINKS
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "rounded-3xl bg-blue-900 border border-slate-400/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-200 hover:text-slate-900"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
=======
            const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.label} href={item.href} className={`flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "rounded-3xl bg-blue-900 border border-slate-400/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-200 hover:text-slate-900"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}>
>>>>>>> 6ad1e91de3843aa6218e0ce0c5bd23937e1d3fd2
                {!collapsed ? item.label : null}
              </Link>
            );
          })}

          {!collapsed ? (
            <button
              type="button"
              onClick={() => setCatalogueOpen((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-3xl bg-slate-50 px-4 py-3 text-left text-sm font-medium transition hover:bg-slate-100"
            >
              <span>Catalogue</span>
              <span className={`text-slate-400 transition-transform ${catalogueOpen ? "rotate-90" : ""}`}>
                ›
              </span>
            </button>
          ) : null}

          {!collapsed && catalogueOpen
            ? catalogueLinks.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`ml-4 flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "rounded-3xl bg-blue-900 border border-slate-400/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-200 hover:text-slate-900"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })
            : null}
        </nav>
      </div>

      {/* TOGGLE BUTTON */}
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