// app/api/tokens/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tokens = await prisma.token.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tokens);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}
