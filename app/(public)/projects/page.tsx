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
          <Card
            key={p.id}
            className="flex flex-col border-border bg-surface overflow-hidden"
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
            <CardHeader className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg">{p.title}</CardTitle>
                <span className="shrink-0 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                  {statusLabel[p.status]}
                </span>
              </div>
              <CardDescription className="line-clamp-3">
                {p.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {p.link ? (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Voir le projet
                  </a>
                </Button>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Lien à venir
                </span>
              )}
            </CardContent>
          </Card>
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
