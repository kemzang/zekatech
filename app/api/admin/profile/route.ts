import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { invalidPayload, prismaError } from "@/lib/api-errors";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100),
});

export const PUT = withAdmin(async (req, _ctx, session) => {
  const email = session.user.email!;
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
});
