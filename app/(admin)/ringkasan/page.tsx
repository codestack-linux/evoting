export const dynamic = "force-dynamic";
import DownloadRekap from "@/components/DownloadRekap";
import QuickCountChart from "@/components/QuickCountChart";
import { Activity } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="p-6 md:p-10 mx-auto bg-pink-50">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
              Sistem Live
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Ringkasan Suara <span className="text-blue-600">.</span>
          </h1>
        </div>

        {/* TOMBOL DOWNLOAD ADA DI SINI */}
        <div className="flex items-center gap-3">
          <DownloadRekap />
          <div className="hidden md:flex bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm items-center gap-3">
            <Activity className="text-blue-600 w-5 h-5" />
            <span className="text-sm font-bold text-slate-600">
              Pemantauan Live
            </span>
          </div>
        </div>
      </header>

      <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-xl font-bold text-slate-800">
            Perolehan Suara Kandidat
          </h3>
          <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
            Auto-refresh aktif
          </span>
        </div>

        <QuickCountChart />
      </div>

      <footer className="mt-10 text-center">
        <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em]">
          Dikelola oleh Tim IT SMK N Wonoasri
        </p>
      </footer>
    </div>
  );
}
