import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { invalidPayload, prismaError } from "@/lib/api-errors";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100),
});

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    // Le corps n'etait pas valide du tout : `name` pouvait etre de n'importe
    // quel type et de n'importe quelle longueur.
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return invalidPayload(parsed.error);

    const updated = await prisma.user.update({
      where: { email: session.user.email },
      data: { name: parsed.data.name },
    });
    return NextResponse.json({ ok: true, name: updated.name });
  } catch (e) {
    return prismaError(e, "Erreur lors de la mise à jour.");
  }
}
