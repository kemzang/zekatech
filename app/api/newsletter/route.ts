import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";

const bodySchema = z.object({
  email: z.email().max(200),
});

export async function POST(req: Request) {
  const limit = rateLimit(`newsletter:${clientIp(req)}`, 5, 60 * 60_000);
  if (!limit.ok) return tooManyRequests(limit);

  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Email invalide." },
        { status: 400 }
      );
    }
    const { email } = parsed.data;
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email, active: true },
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
