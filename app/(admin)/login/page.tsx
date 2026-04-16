// app/(admin)/login/page.tsx
"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/lib/actions/auth";

export default function LoginPage() {
  // useActionState digunakan untuk menangkap return value (error) dari server action
  const [state, formAction, isPending] = useActionState(loginAdmin, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-pink-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">E-Voting OSIS</h1>
          <p className="text-slate-500 text-sm">Masuk ke panel administrator</p>
        </div>

        <form action={formAction} className="space-y-5">
          {/* Tampilkan pesan error jika login gagal */}
          {state?.error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {state.error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              className="w-full text-slate-900 border-amber-50 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full text-slate-900 border-amber-50 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition disabled:bg-blue-400"
          >
            {isPending ? "Mencoba Masuk..." : "Login Admin"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400 italic">
            Hanya petugas yang diizinkan masuk.
          </p>
          <small className="text-bold text-slate-400">
            Powered by DWI OKTA
          </small>
        </div>
      </div>
    </div>
  );
}
