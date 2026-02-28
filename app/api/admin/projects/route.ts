import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";
import { ProjectStatus } from "@prisma/client";

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus),
  imageUrl: z.string().url().optional().or(z.literal("")),
  imageUrls: z.array(z.string().min(1)).optional(),
  videoUrl: z.string().min(1).optional().or(z.literal("")),
  link: z.string().url().optional().or(z.literal("")),
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
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides." },
        { status: 400 }
      );
    }
    const data = parsed.data;
    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description ?? null,
        status: data.status,
        imageUrl: data.imageUrl || (data.imageUrls?.[0] ?? null),
        imageUrls: data.imageUrls?.length ? JSON.stringify(data.imageUrls) : null,
        videoUrl: data.videoUrl || null,
        link: data.link || null,
        order: data.order ?? 0,
      },
    });
    return NextResponse.json(project);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erreur lors de la création." },
      { status: 500 }
    );
  }
}
