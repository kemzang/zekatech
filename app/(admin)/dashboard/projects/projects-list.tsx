"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";

type Project = {
  id: string;
  title: string;
  slug: string;
  status: string;
  statusLabel: string;
};

export function ProjectsList({
  projects,
}: {
  projects: Project[];
}) {
  async function deleteProject(id: string) {
    if (!confirm("Supprimer ce projet ?")) return;
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (res.ok) window.location.reload();
  }

  return (
    <div className="space-y-2">
      {projects.length === 0 ? (
        <p className="text-muted-foreground">Aucun projet.</p>
      ) : (
        projects.map((p) => (
          <Card key={p.id} className="border-border bg-surface">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-foreground">{p.title}</p>
                <p className="text-sm text-muted-foreground">
                  {p.slug} · {p.statusLabel}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/dashboard/projects/${p.id}/edit`}>
                    <Pencil className="size-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => deleteProject(p.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
