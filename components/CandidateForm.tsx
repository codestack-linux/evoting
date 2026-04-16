"use client";

import { useActionState, useEffect, useRef } from "react";
import { createCandidate } from "@/lib/actions/candidate";
import { Loader2, UserPlus } from "lucide-react";

export default function CandidateForm() {
  const [state, formAction, isPending] = useActionState(createCandidate, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Nama Lengkap
          </label>
          <input
            name="name"
            type="text"
            className="w-full text-slate-900 px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="Contoh: Ahmad Fauzi"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            URL Foto
          </label>
          <input
            name="photo"
            type="text"
            className="w-full px-4 text-slate-900 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="https://image-link.com/photo.jpg"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Visi
        </label>
        <textarea
          name="vision"
          rows={2}
          className="w-full px-4 py-3 rounded-2xl text-slate-900 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="Visi utama kandidat..."
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Misi
        </label>
        <textarea
          name="mission"
          rows={4}
          className="w-full px-4 py-3 rounded-2xl text-slate-900 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="1. Misi pertama&#10;2. Misi kedua..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <UserPlus className="w-5 h-5" />
        )}
        Daftarkan Kandidat
      </button>

      {state?.error && (
        <p className="text-red-500 text-sm font-medium">{state.error}</p>
      )}
    </form>
  );
}
