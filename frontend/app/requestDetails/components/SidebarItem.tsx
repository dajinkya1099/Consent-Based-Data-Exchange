import { SidebarItem } from "../types";

interface Props {
  item: SidebarItem;
  active: boolean;
}

export default function SidebarItem({ item, active }: Props) {
  return (
    <button
      type="button"
      className={`group flex w-full items-center gap-4 rounded-3xl px-5 py-4 text-left transition-all duration-200 ${
        active
  ? "bg-white text-blue-900 font-semibold shadow-md"
  : "text-blue-100 hover:bg-blue-800 hover:text-white"
      }`}
    >
      <span
        className={`grid h-11 w-11 place-items-center rounded-2xl text-lg ${
          active ? "bg-white text-slate-900" : "bg-slate-100 text-slate-700"
        }`}
      >
        {item.icon}
      </span>
      <span className="font-medium">{item.label}</span>
    </button>
  );
}
