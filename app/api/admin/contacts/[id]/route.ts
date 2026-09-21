import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth";
import { invalidPayload, prismaError } from "@/lib/api-errors";
import { z } from "zod";

const updateSchema = z.object({
  read: z.boolean(),
});

export const PATCH = withAdmin(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    try {
      const body = await req.json().catch(() => ({}));
      const parsed = updateSchema.safeParse(body);
      if (!parsed.success) return invalidPayload(parsed.error);
      const contact = await prisma.contactRequest.update({
        where: { id },
        data: { read: parsed.data.read },
      });
      return NextResponse.json({ ok: true, read: contact.read });
    } catch (e) {
      return prismaError(e, "Erreur lors de la mise à jour.");
    }
  },
);
