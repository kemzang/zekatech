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
import { ProjectCard } from "@/components/project-card";

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
      prisma.service.findMany({ where: { active: true }, orderBy: { order: "asc" }, take: 4 }),
      prisma.project.findMany({ where: { active: true }, orderBy: { order: "asc" }, take: 3 }),
      prisma.partner.findMany({ where: { active: true }, orderBy: { order: "asc" }, take: 6 }),
    ]);
  } catch {
    // Base de données indisponible (ex. PostgreSQL non démarré)
  }
  type ServiceItem = (typeof services)[number];
  type ProjectItem = (typeof projects)[number];
  type PartnerItem = (typeof partners)[number];
  const projectStatusLabel: Record<string, string> = {
    REALISE: "Réalisé",
    EN_COURS: "En cours",
    AUTRE: "Autre",
  };

  return (
    <div>
      {/* Hero avec image background professionnelle */}
      <section className="relative overflow-hidden">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
            alt="Technology background"
            className="h-full w-full object-cover"
          />
          {/* Overlay sombre pour la lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/60" />
        </div>
        
        {/* Contenu du hero */}
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            {/* <div className="mb-6 inline-block rounded-full bg-primary/20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-primary-foreground border border-primary/30">
              💼 Développeur Full-Stack
            </div> */}
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl drop-shadow-lg">
              Développement logiciel sur mesure
            </h1>
            <p className="mt-6 text-lg text-gray-200 md:text-xl">
              Web, mobile, API et conseil. Je conçois et réalise vos projets avec
              des technologies modernes.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="shadow-xl shadow-primary/30 bg-primary hover:bg-primary/90">
                <Link href="/services">
                  Voir les services
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                <Link href="/contact">Me contacter</Link>
              </Button>
            </div>
            
            {/* Stats ou badges */}
            {/* <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/20 pt-8">
              <div>
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-300">Projets réalisés</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-300">Satisfaction client</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-300">Support disponible</div>
              </div>
            </div> */}
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
              <ProjectCard
                key={p.id}
                title={p.title}
                description={p.description}
                status={p.status}
                statusLabel={projectStatusLabel[p.status] ?? p.status}
                link={p.link}
                videoUrl={(p as { videoUrl?: string | null }).videoUrl ?? null}
                imageUrl={p.imageUrl}
                imageUrls={(p as { imageUrls?: string | null }).imageUrls ?? null}
              />
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
