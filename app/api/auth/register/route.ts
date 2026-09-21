import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { z } from "zod";
import { passwordSchema } from "@/lib/password";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";

const registerSchema = z.object({
  email: z.email().max(200),
  password: passwordSchema,
  name: z.string().min(1).max(100).optional(),
});

export async function POST(req: Request) {
  const limit = rateLimit(`register:${clientIp(req)}`, 5, 60 * 60_000);
  if (!limit.ok) return tooManyRequests(limit);

  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { password, name } = parsed.data;
    const email = parsed.data.email.trim().toLowerCase();
    const existing = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email." },
        { status: 409 }
      );
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { email, passwordHash, name: name || null, role: "USER" },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    // Le detail (DATABASE_URL, identifiants PostgreSQL...) reste dans les logs
    // serveur : le client ne recoit qu'un message neutre.
    console.error("[register]", e);
    return NextResponse.json(
      { error: "Inscription momentanément indisponible. Réessayez plus tard." },
      { status: 503 }
    );
  }
}
