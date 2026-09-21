import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { invalidPayload, prismaError } from "@/lib/api-errors";
import { serializeImageUrls } from "@/lib/project-images";
import { z } from "zod";
import { ProjectStatus } from "@prisma/client";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "minuscules, chiffres et tirets uniquement"),
  description: z.string().max(5000).optional(),
  status: z.enum(ProjectStatus),
  imageUrl: z.string().optional(),
  imageUrls: z.array(z.string().min(1)).max(20).optional(),
  videoUrl: z.string().optional(),
  link: z.union([z.url(), z.literal("")]).optional(),
  order: z.number().int().optional(),
});

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(projects);
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
    if (!parsed.success) return invalidPayload(parsed.error);
    const data = parsed.data;
    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description ?? null,
        status: data.status,
        imageUrl: data.imageUrl || (data.imageUrls?.[0] ?? null),
        imageUrls: serializeImageUrls(data.imageUrls ?? []),
        videoUrl: data.videoUrl || null,
        link: data.link || null,
        order: data.order ?? 0,
      },
    });
    return NextResponse.json(project);
  } catch (e) {
    return prismaError(e, "Erreur lors de la création.");
  }
}
