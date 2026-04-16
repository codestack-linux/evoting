// app/api/stats/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        _count: {
          select: { votes: true },
        },
      },
    });

    const totalVotes = await prisma.vote.count();
    const totalTokens = await prisma.token.count();

    const chartData = candidates.map((c) => ({
      name: c.name,
      suara: c._count.votes,
    }));

    return NextResponse.json({
      chartData,
      totalVotes,
      totalTokens,
      participation:
        totalTokens > 0 ? Math.round((totalVotes / totalTokens) * 100) : 0,
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat data" }, { status: 500 });
  }
}
