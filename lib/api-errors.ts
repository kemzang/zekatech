import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import type { ZodError } from "zod";

/** 400 détaillé : l'admin doit savoir quel champ est fautif. */
export function invalidPayload(error: ZodError) {
  const fields = error.flatten().fieldErrors;
  const detail = error.issues
    .map((i) => (i.path.length ? `${i.path.join(".")} : ${i.message}` : i.message))
    .join(" · ");
  return NextResponse.json(
    { error: detail || "Données invalides.", fields },
    { status: 400 }
  );
}

/**
 * Traduit les erreurs Prisma connues en réponses HTTP utiles
 * (contrainte d'unicité -> 409, enregistrement absent -> 404) au lieu d'un 500.
 */
export function prismaError(e: unknown, fallback: string) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") {
      const target = e.meta?.target;
      const field = Array.isArray(target) ? target.join(", ") : String(target ?? "");
      return NextResponse.json(
        {
          error: field
            ? `Cette valeur est déjà utilisée (${field}).`
            : "Cette valeur est déjà utilisée.",
        },
        { status: 409 }
      );
    }
    if (e.code === "P2025") {
      return NextResponse.json({ error: "Introuvable." }, { status: 404 });
    }
  }
  console.error(e);
  return NextResponse.json({ error: fallback }, { status: 500 });
}
