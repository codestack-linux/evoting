"use client";

import { useEffect, useState } from "react";

interface Token {
  id: number;
  code: string;
  isUsed: boolean;
}

export default function TokenGridRealtime({
  initialTokens,
}: {
  initialTokens: Token[];
}) {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);

  useEffect(() => {
    // Polling setiap 2 detik untuk mengecek status token
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/tokens");
        if (res.ok) {
          const data = await res.json();
          setTokens(data);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Hitung ulang statistik secara realtime
  const usedCount = tokens.filter((t) => t.isUsed).length;
  const availableCount = tokens.length - usedCount;

  return (
    <>
      {/* Kita pindahkan Header Stat ke sini supaya angka ikut berubah */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 mb-12 self-end">
        <div className="px-6 py-2">
          <span className="block text-xs text-slate-400 uppercase tracking-widest font-bold">
            Tersedia
          </span>
          <span className="text-2xl font-black text-slate-800">
            {availableCount}
          </span>
        </div>
        <div className="w-[1px] h-10 bg-slate-100"></div>
        <div className="px-6 py-2 text-right">
          <span className="block text-xs text-slate-400 uppercase tracking-widest font-bold">
            Terpakai
          </span>
          <span className="text-2xl font-black text-blue-600">{usedCount}</span>
        </div>
      </div>

      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 ml-2">
        Daftar Kode Unik
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tokens.map((token) => (
          <div
            key={token.id}
            className={`group p-5 rounded-2xl border-2 transition-all duration-500 ${
              token.isUsed
                ? "bg-slate-100 border-transparent grayscale opacity-50 scale-95"
                : "bg-white border-slate-100 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-100"
            }`}
          >
            <div className="flex flex-col gap-1">
              <span
                className={`text-[10px] font-black uppercase tracking-tighter ${
                  token.isUsed ? "text-slate-400" : "text-blue-500"
                }`}
              >
                {token.isUsed ? "Finished" : "Ready to Use"}
              </span>
              <span className="text-xl font-mono font-black text-slate-800 group-hover:scale-110 transition-transform origin-left">
                {token.code}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
