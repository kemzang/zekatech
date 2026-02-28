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

export default async function ProjectsPage() {
  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  try {
    projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
  } catch {
    // Base de données indisponible
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-foreground">Projets</h1>
        <p className="mt-2 text-muted-foreground">
          Réalisations et projets sur lesquels je travaille.
        </p>
      </div>
      <div className="mx-auto mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            title={p.title}
            description={p.description}
            status={p.status}
            statusLabel={statusLabel[p.status]}
            link={p.link}
            videoUrl={p.videoUrl}
            imageUrl={p.imageUrl}
            imageUrls={p.imageUrls}
          />
        ))}
      </div>
      {projects.length === 0 && (
        <p className="mt-8 text-center text-muted-foreground">
          Aucun projet pour le moment.
        </p>
      )}
    </div>
  );
}
