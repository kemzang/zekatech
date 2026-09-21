import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { invalidPayload, prismaError } from "@/lib/api-errors";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const list = await prisma.service.findMany({
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
    const { name, slug, description, icon, order, active } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Le nom et le slug sont requis." },
        { status: 400 }
      );
    }

    const existing = await prisma.service.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Un service avec ce slug existe déjà." },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name,
        slug,
        description: description || null,
        icon: icon || null,
        order: order || 0,
        active: active !== false,
      },
    });
    revalidatePath("/");
    revalidatePath("/services");
return NextResponse.json(service);
  } catch (e) {
    return prismaError(e, "Erreur lors de la création.");
  }
}
