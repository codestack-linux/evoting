// lib/actions/token.ts
"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import prisma from "../prisma";

// Tambahkan parameter pertama 'prevState'
export async function generateSingleToken() {
  try {
    // Generate 1 token unik (6 karakter HEX)
    const code = randomBytes(3).toString("hex").toUpperCase();

    await prisma.token.create({
      data: { code },
    });

    revalidatePath("/dashboard/tokens");
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: "Gagal membuat token baru." };
  }
}

export async function deleteAllTokens() {
  // ... isi fungsi
}
