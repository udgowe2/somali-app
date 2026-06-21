import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const situationen = await prisma.situation.findMany({
      where: { aktiv: true },
      orderBy: { reihenfolge: "asc" },
      include: {
        _count: { select: { phrasen: true, dialoge: true, uebungen: true } },
      },
    });
    return NextResponse.json(situationen);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const situation = await prisma.situation.create({ data: body });
  return NextResponse.json(situation, { status: 201 });
}
