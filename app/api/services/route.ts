import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ServiceWhereInput = Parameters<typeof prisma.service.findMany>[0] extends { where?: infer W } ? W : never;
export async function GET() {
  const services = await prisma.service.findMany({
    where: { active: true } as ServiceWhereInput,
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });
  return NextResponse.json(services);
}
