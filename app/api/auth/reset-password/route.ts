import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { z } from "zod";

type PrismaWithReset = typeof prisma & {
  passwordResetToken: {
    findUnique: (args: { where: { token: string }; include: { user: true } }) => Promise<{
      id: string;
      userId: string;
      expiresAt: Date;
      user: { id: string };
    } | null>;
    delete: (args: { where: { id: string } }) => Promise<unknown>;
  };
};

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Au moins 8 caractères"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.flatten().fieldErrors.password?.[0] ?? "Données invalides.";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    const { token, password } = parsed.data;

    const db = prisma as PrismaWithReset;
    const reset = await db.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!reset || reset.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Lien invalide ou expiré. Demandez un nouveau lien." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: reset.userId },
        data: { passwordHash },
      });
      await (tx as PrismaWithReset).passwordResetToken.delete({ where: { id: reset.id } });
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erreur lors de la réinitialisation." },
      { status: 500 }
    );
  }
}
