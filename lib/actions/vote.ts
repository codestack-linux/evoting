"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function validateToken(prevState: any, formData: FormData) {
  const code = formData.get("token") as string;

  const token = await prisma.token.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!token) return { error: "Kode token tidak terdaftar!" };
  if (token.isUsed)
    return { error: "Token ini sudah digunakan untuk memilih." };

  // Simpan token sementara di cookies (Session Bilik)
  const cookieStore = await cookies();
  cookieStore.set("voter_token", token.code, { maxAge: 60 * 5 }); // Berlaku 5 menit

  redirect("/bilik");
}
export async function castVote(candidateId: number) {
  const cookieStore = await cookies();
  const tokenCode = cookieStore.get("voter_token")?.value;

  if (!tokenCode) redirect("/");

  try {
    // 1. Cari token di database untuk mendapatkan ID-nya
    const token = await prisma.token.findUnique({
      where: { code: tokenCode },
    });

    if (!token || token.isUsed) {
      return { error: "Token tidak valid atau sudah digunakan." };
    }

    // 2. Jalankan transaksi
    await prisma.$transaction([
      // Tandai token sebagai terpakai
      prisma.token.update({
        where: { id: token.id },
        data: { isUsed: true },
      }),
      // Buat data pilihan suara dan hubungkan ke token & kandidat
      prisma.vote.create({
        data: {
          candidateId: candidateId,
          tokenId: token.id, // Tambahkan baris ini agar TS tidak error
        },
      }),
    ]);

    // 3. Bersihkan cookie dan pindah ke halaman sukses
    cookieStore.delete("voter_token");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Terjadi kesalahan saat mencatat suara." };
  }
}
