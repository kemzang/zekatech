import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth";

export const GET = withAdmin(async (req: Request) => {
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
});
