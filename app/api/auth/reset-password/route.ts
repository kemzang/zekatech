import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { z } from "zod";
import { hashToken } from "@/lib/tokens";
import { passwordSchema } from "@/lib/password";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";

const schema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});

export async function POST(req: Request) {
  const limit = rateLimit(`reset:${clientIp(req)}`, 10, 15 * 60_000);
  if (!limit.ok) return tooManyRequests(limit);

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      const msg =
        parsed.error.flatten().fieldErrors.password?.[0] ?? "Données invalides.";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    const { token, password } = parsed.data;

    // Le jeton n'existe en base que sous forme d'empreinte.
    const reset = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashToken(token) },
    });

    if (!reset || reset.expiresAt < new Date()) {
      if (reset) {
        await prisma.passwordResetToken.delete({ where: { id: reset.id } });
      }
      return NextResponse.json(
        { error: "Lien invalide ou expiré. Demandez un nouveau lien." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: reset.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.delete({ where: { id: reset.id } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erreur lors de la réinitialisation." },
      { status: 500 }
    );
  }
}
