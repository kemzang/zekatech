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
    <div>
      {/* Hero avec image background */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2074&auto=format&fit=crop"
            alt="Business partnership"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/75 to-primary/40" />
        </div>
        
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-lg">
              Partenaires
            </h1>
            <p className="mt-4 text-lg text-gray-200 md:text-xl">
              Ils me font confiance pour leurs projets.
            </p>
          </div>
        </div>
      </section>

      {/* Partners grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 md:grid-cols-3">
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
      </section>
    </div>
  );
}
