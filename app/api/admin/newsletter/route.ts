import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/auth";

/** Neutralise l'injection de formules dans Excel/LibreOffice. */
function csvCell(value: string) {
  const escaped = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${escaped.replace(/"/g, '""')}"`;
}

export const GET = withAdmin(async (req: Request) => {
  const list = await prisma.newsletterSubscriber.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  if (new URL(req.url).searchParams.get("format") === "csv") {
    // L'export porte sur la liste complète, pas sur la page affichée.
    const rows = [
      "email,inscrit_le",
      ...list.map(
        (s) => `${csvCell(s.email)},${csvCell(s.createdAt.toISOString())}`,
      ),
    ].join("\n");
    const date = new Date().toISOString().slice(0, 10);
    return new Response(`﻿${rows}`, {
      headers: {
        "Content-Type": "text/csv;charset=utf-8",
        "Content-Disposition": `attachment; filename="newsletter-${date}.csv"`,
      },
    });
  }

  return NextResponse.json(list);
});
