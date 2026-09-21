import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { passwordSchema } from "@/lib/password";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";

export async function PUT(req: Request) {
  const limit = rateLimit(`pwd-admin:${clientIp(req)}`, 10, 15 * 60_000);
  if (!limit.ok) return tooManyRequests(limit);

  // Hors du try : sinon un refus d'autorisation ressortait comme une erreur
  // generique.
  let email: string;
  try {
    const session = await requireAdmin();
    email = session.user.email!;
  } catch {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    const policy = passwordSchema.safeParse(newPassword);
    if (!policy.success) {
      return NextResponse.json(
        { error: policy.error.issues[0]?.message ?? "Mot de passe invalide." },
        { status: 400 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
    }

    const valid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Mot de passe actuel incorrect." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { passwordHash },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[profil admin] changement de mot de passe", e);
    return NextResponse.json(
      { error: "Erreur lors du changement de mot de passe." },
      { status: 500 }
    );
  }
}
