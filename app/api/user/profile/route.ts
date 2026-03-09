import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const { name } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name },
    });

    console.log("✅ Profil mis à jour:", updatedUser.name);

    return NextResponse.json({ ok: true, name: updatedUser.name });
  } catch (error) {
    console.error("❌ Erreur mise à jour profil:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  }
}
