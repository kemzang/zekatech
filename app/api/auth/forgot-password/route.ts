import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { randomBytes } from "crypto";

const schema = z.object({
  email: z.string().email(),
});

const RESET_EXPIRY_HOURS = 1;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Email invalide." },
        { status: 400 }
      );
    }
    const { email } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    // Toujours renvoyer ok pour ne pas révéler si l'email existe
    if (!user) {
      return NextResponse.json({
        ok: true,
        message: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
      });
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + RESET_EXPIRY_HOURS * 60 * 60 * 1000);

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    const baseUrl = process.env.NEXTAUTH_URL ?? (req.headers.get("origin") || "http://localhost:3000");
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    // TODO: envoyer l'email avec resetLink (ex: nodemailer, Resend, SendGrid)
    // Pour l'instant en dev on peut retourner le lien pour tester
    const isDev = process.env.NODE_ENV === "development";

    return NextResponse.json({
      ok: true,
      message: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
      ...(isDev && { resetLink }),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erreur lors de la demande." },
      { status: 500 }
    );
  }
}
