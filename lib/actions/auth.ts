// lib/actions/auth.ts
"use server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "../prisma";

export async function loginAdmin(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // 1. Cari user di database
  const user = await prisma.user.findUnique({
    where: { username },
  });

  // 2. Validasi (Username & Password)
  if (!user) {
    return { error: "Username atau password salah" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { error: "Username atau password salah" };
  }

  // 3. Set Cookie Session (Sederhana untuk Admin)
  const cookieStore = await cookies();
  cookieStore.set("admin_session", "active", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 2, // Sesi 2 jam
    path: "/",
  });

  // 4. Redirect ke Dashboard
  redirect("/dashboard");
}
