import prisma from "@/lib/prisma";
import CandidateForm from "@/components/CandidateForm";
import { Trash2, User } from "lucide-react";
import { deleteCandidate } from "@/lib/actions/candidate";
interface Candidate {
  id: number;
  name: string;
  vision: string;
  mission: string;
  photo?: string | null;
}
export default async function CandidatePage() {
  const candidates: Candidate[] = await prisma.candidate.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <div className="min-h-screen bg-pink-50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Kandidat OSIS <span className="text-blue-600">.</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Manajemen profil calon ketua & wakil ketua
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm sticky top-10">
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                Input Data
              </h3>
              <CandidateForm />
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2 space-y-6">
            {candidates.map((c: Candidate, index) => (
              <div
                key={c.id}
                className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 group hover:border-blue-200 transition-all"
              >
                <div className="w-full md:w-32 h-32 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-50">
                  {c.photo ? (
                    <img
                      src={c.photo}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <User size={40} />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">
                        Kandidat #0{index + 1}
                      </span>
                      <h4 className="text-2xl font-black text-slate-800">
                        {c.name}
                      </h4>
                    </div>
                    <form
                      action={async () => {
                        "use server";
                        await deleteCandidate(c.id);
                      }}
                    >
                      <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </form>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">
                        Visi
                      </span>
                      <p className="text-slate-600 mt-1 line-clamp-2">
                        {c.vision}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">
                        Misi
                      </span>
                      <p className="text-slate-600 mt-1 line-clamp-2">
                        {c.mission}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {candidates.length === 0 && (
              <div className="text-center py-20 bg-slate-100/50 rounded-[32px] border-2 border-dashed border-slate-200 text-slate-400 font-medium">
                Belum ada kandidat yang terdaftar.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
