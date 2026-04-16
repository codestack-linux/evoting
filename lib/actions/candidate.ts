// lib/actions/candidate.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCandidate(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const vision = formData.get("vision") as string;
  const mission = formData.get("mission") as string;
  const photo = formData.get("photo") as string; // URL atau Base64

  if (!name || !vision || !mission) {
    return { error: "Semua kolom wajib diisi!" };
  }

  try {
    await prisma.candidate.create({
      data: { name, vision, mission, photo },
    });
    revalidatePath("/dashboard/candidates");
    return { success: true, error: null };
  } catch (error) {
    return { error: "Gagal menyimpan data kandidat." };
  }
}

export async function deleteCandidate(id: number) {
  await prisma.candidate.delete({ where: { id } });
  revalidatePath("/dashboard/candidates");
}
