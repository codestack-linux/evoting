export const dynamic = "force-dynamic";
import { deleteAllTokens } from "@/lib/actions/token";
import TokenForm from "@/components/TokenForm";
import prisma from "@/lib/prisma";
import { PlusIcon } from "lucide-react";
import TokenGridRealtime from "@/components/TokenGridRealtime";
export interface Token {
  id: number;
  code: string;
  isUsed: boolean;
  createdAt: Date;
  usedAt: Date | null;
  vote?: Vote | null;
}

// Interface pendukung jika Anda melakukan fetching include Vote
export interface Vote {
  id: number;
  candidateId: number;
  tokenId: number;
  createdAt: Date;
}
export default async function TokenPage() {
  const initialTokens: Token[] = await prisma.token.findMany({
    orderBy: { createdAt: "desc" },
  });

  const usedCount = initialTokens.filter((t: Token) => t.isUsed).length;
  const availableCount = initialTokens.length - usedCount;

  return (
    <div className="min-h-screen bg-pink-50 p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Token Pemilih <span className="text-blue-600">.</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Manajemen Daftar Pemilih Tetap (DPT) Digital
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
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
              <span className="text-2xl font-black text-blue-600">
                {usedCount}
              </span>
            </div>
          </div>
        </header>

        {/* Action Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Tambah Pemilih
              </h3>
              <p className="text-slate-500 text-sm mb-6 max-w-xs">
                Satu klik akan menghasilkan satu kode unik untuk satu siswa.
              </p>
              <TokenForm />
            </div>
            {/* Dekorasi Abstract */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
          </div>

          <div className="bg-red-50/50 p-8 rounded-[32px] border border-red-100 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-red-900 mb-1">Zona Bahaya</h3>
            <p className="text-red-700/70 text-sm mb-6">
              Bersihkan semua data token jika pemilihan telah usai.
            </p>
            <form
              action={async () => {
                "use server";
                await deleteAllTokens();
              }}
            >
              <button className="w-full py-3 text-sm font-bold text-red-600 border-2 border-red-200 rounded-2xl hover:bg-red-600 hover:text-white transition-all">
                Reset Database Token
              </button>
            </form>
          </div>
        </div>

        {/* Token Grid */}
        <TokenGridRealtime initialTokens={initialTokens} />
      </div>
    </div>
  );
}
