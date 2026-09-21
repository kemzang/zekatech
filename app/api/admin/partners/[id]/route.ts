import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth";
import { invalidPayload, prismaError } from "@/lib/api-errors";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  logoUrl: z.union([z.url(), z.literal("")]).optional(),
  link: z.union([z.url(), z.literal("")]).optional(),
  order: z.number().int().optional(),
  active: z.boolean().optional(),
});

export const GET = withAdmin(
  async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const partner = await prisma.partner.findUnique({ where: { id } });
    if (!partner) return NextResponse.json(null, { status: 404 });
    return NextResponse.json(partner);
  },
);

export const PATCH = withAdmin(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    try {
      const body = await req.json();
      const parsed = updateSchema.safeParse(body);
      if (!parsed.success) return invalidPayload(parsed.error);
      const data = parsed.data;
      const partner = await prisma.partner.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl || null }),
          ...(data.link !== undefined && { link: data.link || null }),
          ...(data.order !== undefined && { order: data.order }),
          ...(data.active !== undefined && { active: data.active }),
        },
      });
      revalidatePath("/");
      revalidatePath("/partners");
      return NextResponse.json(partner);
    } catch (e) {
      return prismaError(e, "Erreur lors de la mise à jour.");
    }
  },
);

export const DELETE = withAdmin(
  async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    try {
      await prisma.partner.update({
        where: { id },
        data: { active: false },
      });
      revalidatePath("/");
      revalidatePath("/partners");
      return NextResponse.json({ ok: true });
    } catch (e) {
      return prismaError(e, "Erreur lors de la désactivation.");
    }
  },
);
