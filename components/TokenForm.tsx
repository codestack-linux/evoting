"use client";

import { useActionState } from "react";
import { generateSingleToken } from "@/lib/actions/token";
import { PlusIcon, Loader2Icon } from "lucide-react";

export default function TokenForm() {
  const [state, formAction, isPending] = useActionState(
    generateSingleToken,
    null
  );

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={isPending}
        className={`group relative flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-semibold transition-all hover:bg-blue-600 active:scale-95 disabled:opacity-70 disabled:active:scale-100 shadow-xl shadow-slate-200`}
      >
        {isPending ? (
          <Loader2Icon className="w-5 h-5 animate-spin" />
        ) : (
          <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform" />
        )}
        <span className="tracking-wide">
          {isPending ? "Mendaftarkan Token..." : "Generate 1 Token Baru"}
        </span>
      </button>

      {state?.error && (
        <p className="mt-4 text-sm text-red-500 font-medium animate-pulse">
          {state.error}
        </p>
      )}
    </form>
  );
}
