import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().url().optional().or(z.literal("")),
  link: z.string().url().optional().or(z.literal("")),
  order: z.number().int().optional(),
});

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const list = await prisma.partner.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides." },
        { status: 400 }
      );
    }
    const data = parsed.data;
    const partner = await prisma.partner.create({
      data: {
        name: data.name,
        logoUrl: data.logoUrl || null,
        link: data.link || null,
        order: data.order ?? 0,
      },
    });
    return NextResponse.json(partner);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erreur lors de la création." },
      { status: 500 }
    );
  }
}
