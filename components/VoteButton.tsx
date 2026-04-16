"use client";

import { useState } from "react";
import { toast } from "sonner";
import { castVote } from "@/lib/actions/vote";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation"; // Import router

export default function VoteButton({
  candidateId,
  candidateName,
}: {
  candidateId: number;
  candidateName: string;
}) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter(); // Inisialisasi router

  const handleVote = async () => {
    const confirmVote = window.confirm(`Yakin ingin memilih ${candidateName}?`);
    if (!confirmVote) return;

    setIsPending(true);

    try {
      const result = await castVote(candidateId);

      if (result?.error) {
        toast.error(result.error);
        setIsPending(false);
      } else if (result?.success) {
        toast.success("Suara berhasil direkam!");

        // Beri jeda sedikit agar toast terlihat sebelum pindah halaman
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    } catch (error) {
      // Abaikan jika ini adalah error redirect internal Next.js
      if (error instanceof Error && error.message === "NEXT_REDIRECT") return;

      console.error(error);
      toast.error("Terjadi kesalahan sistem.");
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={isPending}
      className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
        isPending
          ? "bg-slate-100 text-slate-400"
          : "bg-slate-900 text-white hover:bg-blue-600"
      }`}
    >
      {isPending ? <Loader2 className="animate-spin" /> : "PILIH KANDIDAT"}
    </button>
  );
}
