"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Ticket, Users, LogOut, Vote } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Token Pemilih", href: "/dashboard", icon: Ticket },
    { name: "Data Kandidat", href: "/candidates", icon: Users },
    { name: "Ringkasan", href: "/ringkasan", icon: LayoutDashboard },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Vote className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tighter">
            E-VOTING<span className="text-blue-600"> SMK</span>
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-50">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-red-400 font-bold hover:bg-red-50 rounded-2xl transition-all">
          <LogOut size={20} />
          Keluar Sistem
        </button>
      </div>
    </aside>
  );
}
