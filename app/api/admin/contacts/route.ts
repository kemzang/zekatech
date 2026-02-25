import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get("unread") === "true";
  const list = await prisma.contactRequest.findMany({
    where: unreadOnly ? { read: false } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true, name: true } },
      service: { select: { name: true } },
    },
  });
  return NextResponse.json(list);
}
