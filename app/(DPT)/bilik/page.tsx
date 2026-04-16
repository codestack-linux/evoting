// app/vote/bilik/page.tsx
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { castVote } from "@/lib/actions/vote";
import { User } from "lucide-react";
import VoteButton from "@/components/VoteButton";

interface Candidate {
  id: number;
  name: string;
  vision: string;
  mission: string;
  photo?: string | null;
}
export default async function BilikPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("voter_token")?.value;

  if (!token) redirect("/");

  const candidates: Candidate[] = await prisma.candidate.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
            Bilik Suara Digital
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 tracking-tighter">
            Tentukan Pilihan Anda
          </h1>
          <p className="text-slate-500 mt-3 font-medium">
            Klik tombol "Pilih" pada kandidat pilihan Anda.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {candidates.map((c: Candidate, index) => (
            <div
              key={c.id}
              className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col group hover:-translate-y-2 transition-all duration-300"
            >
              {/* Photo Area */}
              <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                {c.photo ? (
                  <img
                    src={c.photo}
                    alt={c.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User size={80} />
                  </div>
                )}
                <div className="absolute top-6 left-6 bg-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg">
                  {index + 1}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-black text-slate-900 mb-4">
                  {c.name}
                </h3>

                <div className="space-y-4 mb-8 flex-1">
                  <div>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                      Visi
                    </span>
                    <p className="text-slate-600 text-sm leading-relaxed italic">
                      "{c.vision}"
                    </p>
                  </div>
                </div>

                <form
                  action={async () => {
                    "use server";
                    await castVote(c.id);
                  }}
                >
                  {/* <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-95">
                    PILIH KANDIDAT
                  </button> */}
                  <VoteButton candidateId={c.id} candidateName={c.name} />
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
