import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { invalidPayload, prismaError } from "@/lib/api-errors";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100),
});

export async function PUT(req: Request) {
  // Hors du try : sinon un refus d'autorisation ressortait en 500.
  let email: string;
  try {
    const session = await requireAdmin();
    email = session.user.email!;
  } catch {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return invalidPayload(parsed.error);

    const updated = await prisma.user.update({
      where: { email },
      data: { name: parsed.data.name },
    });
    return NextResponse.json({ ok: true, name: updated.name });
  } catch (e) {
    return prismaError(e, "Erreur lors de la mise à jour.");
  }
}
