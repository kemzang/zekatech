import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth";
import { invalidPayload, prismaError } from "@/lib/api-errors";
import { serializeImageUrls } from "@/lib/project-images";
import { z } from "zod";
import { ProjectStatus } from "@prisma/client";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "minuscules, chiffres et tirets uniquement")
    .optional(),
  description: z.string().max(5000).optional(),
  status: z.enum(ProjectStatus).optional(),
  imageUrl: z.string().optional(),
  imageUrls: z.array(z.string().min(1)).max(20).optional(),
  videoUrl: z.string().optional(),
  link: z.union([z.url(), z.literal("")]).optional(),
  order: z.number().int().optional(),
  active: z.boolean().optional(),
});

export const GET = withAdmin(
  async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return NextResponse.json(null, { status: 404 });
    return NextResponse.json(project);
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
      const project = await prisma.project.update({
        where: { id },
        // Une chaîne vide / un tableau vide est un effacement volontaire :
        // seul `undefined` (champ absent) laisse la valeur inchangée.
        data: {
          ...(data.title !== undefined && { title: data.title }),
          ...(data.slug !== undefined && { slug: data.slug }),
          ...(data.description !== undefined && {
            description: data.description || null,
          }),
          ...(data.status !== undefined && { status: data.status }),
          ...(data.imageUrls !== undefined && {
            imageUrls: serializeImageUrls(data.imageUrls),
            imageUrl: data.imageUrls[0] ?? null,
          }),
          ...(data.imageUrls === undefined &&
            data.imageUrl !== undefined && { imageUrl: data.imageUrl || null }),
          ...(data.videoUrl !== undefined && {
            videoUrl: data.videoUrl || null,
          }),
          ...(data.link !== undefined && { link: data.link || null }),
          ...(data.order !== undefined && { order: data.order }),
          ...(data.active !== undefined && { active: data.active }),
        },
      });
      revalidatePath("/");
      revalidatePath("/projects");
      return NextResponse.json(project);
    } catch (e) {
      return prismaError(e, "Erreur lors de la mise à jour.");
    }
  },
);

export const DELETE = withAdmin(
  async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    try {
      await prisma.project.update({
        where: { id },
        data: { active: false },
      });
      revalidatePath("/");
      revalidatePath("/projects");
      return NextResponse.json({ ok: true });
    } catch (e) {
      return prismaError(e, "Erreur lors de la désactivation.");
    }
  },
);
