import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Partenaires | ZekaTech",
  description: "Partenaires et clients.",
};

export default async function PartnersPage() {
  let partners: Awaited<ReturnType<typeof prisma.partner.findMany>> = [];
  try {
    partners = await prisma.partner.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
  } catch {
    // Base de données indisponible
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-foreground">Partenaires</h1>
        <p className="mt-2 text-muted-foreground">
          Ils me font confiance pour leurs projets.
        </p>
      </div>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2 md:grid-cols-3">
        {partners.map((partner) => (
          <a
            key={partner.id}
            href={partner.link ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface p-8 text-center transition-colors hover:border-primary/50 hover:bg-surface-elevated"
          >
            {partner.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={partner.logoUrl}
                alt={partner.name}
                className="max-h-16 w-full object-contain"
              />
            ) : (
              <span className="font-semibold text-foreground">
                {partner.name}
              </span>
            )}
          </a>
        ))}
      </div>
      {partners.length === 0 && (
        <p className="mt-8 text-center text-muted-foreground">
          Aucun partenaire pour le moment.
        </p>
      )}
    </div>
  );
}
