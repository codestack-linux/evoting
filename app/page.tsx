// app/vote/page.tsx
"use client";

import { useActionState } from "react";
import { validateToken } from "@/lib/actions/vote";
import { Ticket, ArrowRight, Loader2 } from "lucide-react";

export default function EntryPage() {
  const [state, formAction, isPending] = useActionState(validateToken, null);

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl shadow-slate-200 p-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
            <Ticket className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Selamat Datang
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Masukkan kode unik untuk memulai pemilihan.
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <input
              name="token"
              type="text"
              placeholder="CONTOH: A1B2C3"
              required
              className="w-full text-slate-900 text-center text-3xl font-mono font-bold tracking-widest py-5 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all uppercase"
            />
            {state?.error && (
              <p className="text-red-500 text-center mt-4 font-bold text-sm bg-red-50 py-2 rounded-xl">
                ⚠️ {state.error}
              </p>
            )}
          </div>

          <button
            disabled={isPending}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Mulai Memilih <ArrowRight />
              </>
            )}
          </button>
        </form>

        <footer className="mt-12 text-center border-t border-slate-50 pt-6">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Digital Voting System SMK
          </p>
          <small className="text-bold text-slate-400">
            Powered by DWI OKTA
          </small>
        </footer>
      </div>
    </div>
  );
}
