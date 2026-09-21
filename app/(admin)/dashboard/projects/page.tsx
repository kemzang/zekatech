import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Pagination, resolvePage } from "@/components/pagination";
import { projectStatusLabel } from "@/lib/project-status";
import { ProjectsList } from "./projects-list";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function DashboardProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const total = await prisma.project.count();
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const page = resolvePage((await searchParams).page, pageCount);

  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
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
            statusLabel: projectStatusLabel(p.status),
          }))}
        />
      </div>
      <Pagination
        page={page}
        pageCount={pageCount}
        basePath="/dashboard/projects"
        total={total}
        label="projet(s)"
      />
    </div>
  );
}
