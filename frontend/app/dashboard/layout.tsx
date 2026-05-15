"use client";

import { useState } from "react";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { TopNav } from "../../components/dashboard/TopNav";
import ChatbotWidget from "../../components/chatbot/ChatbotWidget";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="h-screen flex bg-slate-100 overflow-hidden">
      
      {/* ✅ Sidebar (fixed + scrollable) */}
      <div className="h-screen sticky top-0">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
        />
      </div>

      {/* ✅ Main Area */}
      <div className="flex flex-1 flex-col h-screen">

        {/* ✅ TopNav fixed */}
        <div className="shrink-0 sticky top-0 z-20 bg-slate-100 px-4 pt-4">
          <TopNav onProfileClick={() => {}} />
        </div>

        {/* ✅ ONLY THIS SCROLLS */}
        <main className="flex-1 overflow-y-auto px-4 pb-6">
          {children}
        </main>

         {/* Global Chatbot */}
      <ChatbotWidget />

      </div>
    </div>
  );
}