import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ProjectStatus } from "@prisma/client";
import { ProjectsList } from "./projects-list";

const statusLabel: Record<ProjectStatus, string> = {
  REALISE: "Réalisé",
  EN_COURS: "En cours",
  AUTRE: "Autre",
};

export default async function DashboardProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Projets</h1>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="size-4" />
            Nouveau
          </Link>
        </Button>
      </div>
      <p className="mt-1 text-muted-foreground">
        Gérer les projets affichés sur le site.
      </p>
      <div className="mt-6">
        <ProjectsList
          projects={projects.map((p) => ({
            ...p,
            statusLabel: statusLabel[p.status],
          }))}
        />
      </div>
    </div>
  );
}
