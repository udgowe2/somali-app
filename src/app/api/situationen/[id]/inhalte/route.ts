import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Zeile = { sprecher: string; somali: string; deutsch: string; ist_luecke: boolean };
type Uebung = { typ: string; inhalt: Record<string, unknown> };

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const situationId = parseInt(id);
  const body = await req.json();

  await prisma.$transaction([
    prisma.phrase.createMany({
      data: body.phrasen.map((p: { somali: string; deutsch: string }, i: number) => ({
        situation_id: situationId, somali: p.somali, deutsch: p.deutsch, reihenfolge: i,
      })),
    }),
    prisma.dialog.create({
      data: {
        situation_id: situationId,
        titel: body.dialog.titel,
        zeilen: {
          create: body.dialog.zeilen.map((z: Zeile, i: number) => ({
            sprecher: z.sprecher, somali: z.somali, deutsch: z.deutsch,
            ist_luecke: z.ist_luecke, reihenfolge: i,
          })),
        },
      },
    }),
    prisma.uebung.createMany({
      data: body.uebungen.map((u: Uebung, i: number) => ({
        situation_id: situationId, typ: u.typ as never, inhalt: u.inhalt, reihenfolge: i,
      })),
    }),
  ]);

  return NextResponse.json({ ok: true }, { status: 201 });
}
