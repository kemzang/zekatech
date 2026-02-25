import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code2, Globe, Smartphone, Server, ArrowRight } from "lucide-react";
import { NewsletterBlock } from "@/components/newsletter-block";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  globe: Globe,
  smartphone: Smartphone,
  server: Server,
  layout: Code2,
};

export default async function HomePage() {
  let services: Awaited<ReturnType<typeof prisma.service.findMany>> = [];
  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  let partners: Awaited<ReturnType<typeof prisma.partner.findMany>> = [];
  try {
    [services, projects, partners] = await Promise.all([
      prisma.service.findMany({ orderBy: { order: "asc" }, take: 4 }),
      prisma.project.findMany({ orderBy: { order: "asc" }, take: 3 }),
      prisma.partner.findMany({ orderBy: { order: "asc" }, take: 6 }),
    ]);
  } catch {
    // Base de données indisponible (ex. MySQL non démarré)
  }
  type ServiceItem = (typeof services)[number];
  type ProjectItem = (typeof projects)[number];
  type PartnerItem = (typeof partners)[number];

  return (
    <div>
      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Développement logiciel sur mesure
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Web, mobile, API et conseil. Je conçois et réalise vos projets avec
            des technologies modernes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/services">
                Voir les services
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Me contacter</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="border-t border-border bg-surface py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-foreground">Services</h2>
          <p className="mt-1 text-muted-foreground">
            Développement web, applications mobiles, APIs et accompagnement.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s: ServiceItem) => {
              const Icon = iconMap[s.icon ?? "layout"] ?? Code2;
              return (
                <Card
                  key={s.id}
                  className="border-border bg-background transition-colors hover:border-primary/50"
                >
                  <CardHeader>
                    <Icon className="size-8 text-primary" />
                    <CardTitle className="text-lg">{s.name}</CardTitle>
                    <CardDescription>{s.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <Link href="/services">Tous les services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Projects preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-foreground">Projets</h2>
          <p className="mt-1 text-muted-foreground">
            Réalisations et projets en cours.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p: ProjectItem) => (
              <Card
                key={p.id}
                className="border-border bg-surface overflow-hidden"
              >
                {p.imageUrl && (
                  <div className="aspect-video bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{p.title}</CardTitle>
                    <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                      {p.status}
                    </span>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {p.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {p.link && (
                    <Button variant="link" size="sm" asChild>
                      <a href={p.link} target="_blank" rel="noopener noreferrer">
                        Voir le projet
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline" asChild>
              <Link href="/projects">Tous les projets</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Partners */}
      {partners.length > 0 && (
        <section className="border-t border-border bg-surface py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Partenaires
            </h2>
            <p className="mt-1 text-muted-foreground">
              Ils me font confiance pour leurs projets.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
              {partners.map((partner: PartnerItem) => (
                <a
                  key={partner.id}
                  href={partner.link ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {partner.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="h-10 object-contain"
                    />
                  ) : (
                    <span className="font-medium">{partner.name}</span>
                  )}
                </a>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/partners">Voir tous</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <NewsletterBlock />
        </div>
      </section>
    </div>
  );
}
