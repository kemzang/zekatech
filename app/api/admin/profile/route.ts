import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await requireAdmin();
    const { name } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email! },
      data: { name },
    });

    console.log("✅ Profil admin mis à jour:", updatedUser.name);

    return NextResponse.json({ ok: true, name: updatedUser.name });
  } catch (error) {
    console.error("❌ Erreur mise à jour profil admin:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  }
}
