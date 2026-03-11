import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { ProjectCard } from "@/components/project-card";

export const metadata = {
  title: "Projets | ZekaTech",
  description: "Projets réalisés et en cours.",
};

const statusLabel: Record<string, string> = {
  REALISE: "Réalisé",
  EN_COURS: "En cours",
  AUTRE: "Autre",
};

type ProjectRow = Awaited<ReturnType<typeof prisma.project.findMany>>[number] & {
  videoUrl?: string | null;
  imageUrls?: string | null;
};

export default async function ProjectsPage() {
  let projects: ProjectRow[] = [];
  try {
    type FindManyOptions = NonNullable<Parameters<typeof prisma.project.findMany>[0]>;
    projects = (await prisma.project.findMany({
      where: { active: true } as FindManyOptions["where"],
      orderBy: { order: "asc" },
    })) as ProjectRow[];
  } catch {
    // Base de données indisponible
  }

  return (
    <div>
      {/* Hero avec image background */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
            alt="Project showcase"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/75 to-primary/40" />
        </div>
        
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-lg">
              Projets
            </h1>
            <p className="mt-4 text-lg text-gray-200 md:text-xl">
              Réalisations et projets sur lesquels je travaille.
            </p>
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                title={p.title}
                description={p.description}
                status={p.status}
                statusLabel={statusLabel[p.status]}
                link={p.link}
                videoUrl={p.videoUrl ?? null}
                imageUrl={p.imageUrl}
                imageUrls={p.imageUrls ?? null}
              />
            ))}
          </div>
          {projects.length === 0 && (
            <p className="mt-8 text-center text-muted-foreground">
              Aucun projet pour le moment.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
