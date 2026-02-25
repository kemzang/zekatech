import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  if (body.read === true) {
    await prisma.contactRequest.update({
      where: { id },
      data: { read: true },
    });
  }
  return NextResponse.json({ ok: true });
}
