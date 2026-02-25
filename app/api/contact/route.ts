import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/auth";
import { z } from "zod";

const bodySchema = z.object({
  serviceId: z.string().min(1),
  subject: z.string().optional(),
  message: z.string().min(1, "Message requis"),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map((e) => e.message).join(" ");
      return NextResponse.json(
        { error: msg || "Données invalides." },
        { status: 400 }
      );
    }
    const { serviceId, subject, message } = parsed.data;
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      return NextResponse.json(
        { error: "Service invalide." },
        { status: 400 }
      );
    }
    await prisma.contactRequest.create({
      data: {
        userId: session.user.id,
        serviceId,
        subject: subject ?? null,
        message,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
