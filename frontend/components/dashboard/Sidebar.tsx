"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "All Datasets", href: "/get/all-dataset" },
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

const requestAccessLinks = [
  { label: "Access Request", href: "/request-access" },
  { label: "Pending Request", href: "/pendingRequests" },
  { label: "Approved Requests", href: "/approvedRequests" },
  { label: "Rejected Requests", href: "/rejectedRequests" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const [catalogueOpen, setCatalogueOpen] = useState(true);

  const [requestAccessOpen, setRequestAccessOpen] = useState(true);

  return (
    <aside
      className={`h-screen overflow-y-auto border border-slate-200 bg-gradient-to-r from-sky-100 to-blue-300 p-5 shadow-sm transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex h-full flex-col justify-between">
        
        {/* TOP SECTION */}
        <div>
          
          {/* LOGO */}
          <div
            className={`mb-10 flex items-center ${
              collapsed ? "justify-center" : "gap-3"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-xl font-semibold text-white shadow-sm">
              C
            </div>

            {!collapsed && (
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  ConsentX
                </p>

                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Data Exchange
                </p>
              </div>
            )}
          </div>

          {/* MENU */}
          <nav className="space-y-2">

            {/* MAIN LINKS */}
            {links.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center rounded-3xl px-4 py-3 text-sm font-medium transition ${
                    collapsed ? "justify-center" : "gap-3"
                  } ${
                    isActive
                      ? "bg-blue-900 text-white"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {!collapsed && item.label}
                </Link>
              );
            })}

            {/* CATALOGUE DROPDOWN */}
            {!collapsed && (
              <>
                <button
                  type="button"
                  onClick={() => setCatalogueOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-3xl bg-slate-50 px-4 py-3 text-left text-sm font-medium transition hover:bg-slate-100"
                >
                  <span>Catalogue</span>

                  <span
                    className={`transition-transform ${
                      catalogueOpen ? "rotate-90" : ""
                    }`}
                  >
                    ›
                  </span>
                </button>

                {catalogueOpen && (
                  <div className="ml-4 space-y-2">
                    {catalogueLinks.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          className={`flex rounded-3xl px-4 py-3 text-sm font-medium transition ${
                            isActive
                              ? "bg-blue-900 text-white"
                              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}
            

            {/* REQUEST ACCESS DROPDOWN */}
            {!collapsed && (
              <>
                <button
                  type="button"
                  onClick={() => setRequestAccessOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-3xl bg-slate-50 px-4 py-3 text-left text-sm font-medium transition hover:bg-slate-100"
                >
                  <span>Requests Access</span>

                  <span
                    className={`transition-transform ${
                      requestAccessOpen ? "rotate-90" : ""
                    }`}
                  >
                    ›
                  </span>
                </button>

                {requestAccessOpen && (
                  <div className="ml-4 space-y-2">
                    {requestAccessLinks.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          className={`flex rounded-3xl px-4 py-3 text-sm font-medium transition ${
                            isActive
                              ? "bg-blue-900 text-white"
                              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </nav>
        </div>

        {/* COLLAPSE BUTTON */}
        <button
          type="button"
          onClick={onToggle}
          className="mt-6 inline-flex w-full items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:border-slate-300 hover:bg-slate-100"
        >
          {collapsed ? "→" : "Collapse Sidebar"}
        </button>
      </div>
    </aside>
  );
}