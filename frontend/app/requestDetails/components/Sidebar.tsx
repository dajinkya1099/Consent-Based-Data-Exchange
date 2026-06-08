import { SIDEBAR_ITEMS } from "../constants";
import SidebarItem from "./SidebarItem";

interface Props {
  activeId: string;
}

export default function Sidebar({ activeId }: Props) {
  return (
    <aside className="flex h-full min-h-screen w-full max-w-[320px] flex-col gap-6 rounded-[32px] border border-blue-800 bg-blue-900 p-6 shadow-xl shadow-blue-950/30 xl:sticky xl:top-6 xl:min-h-[calc(100vh-48px)]">
  <div>
    <p className="text-xs uppercase tracking-[0.28em] text-blue-200">
      Dashboard
    </p>

    <h2 className="mt-4 text-2xl font-semibold text-white">
      Access requests
    </h2>
  </div>

  <div className="grid gap-3">
    {SIDEBAR_ITEMS.map((item) => (
      <SidebarItem
        key={item.id}
        item={item}
        active={item.id === activeId}
      />
    ))}
  </div>

  <div className="mt-auto rounded-3xl bg-blue-800/50 p-5 text-sm text-blue-100 shadow-inner">
    <p className="font-semibold text-white">Quick help</p>
  </div>
</aside>
  );
}
