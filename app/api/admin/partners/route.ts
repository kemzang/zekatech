import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth";
import { invalidPayload, prismaError } from "@/lib/api-errors";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(200),
  logoUrl: z.union([z.url(), z.literal("")]).optional(),
  link: z.union([z.url(), z.literal("")]).optional(),
  order: z.number().int().optional(),
});

export const GET = withAdmin(async () => {
  const list = await prisma.partner.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(list);
});

export const POST = withAdmin(async (req: Request) => {
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return invalidPayload(parsed.error);
    const data = parsed.data;
    const partner = await prisma.partner.create({
      data: {
        name: data.name,
        logoUrl: data.logoUrl || null,
        link: data.link || null,
        order: data.order ?? 0,
      },
    });
    revalidatePath("/");
    revalidatePath("/partners");
    return NextResponse.json(partner);
  } catch (e) {
    return prismaError(e, "Erreur lors de la création.");
  }
});
