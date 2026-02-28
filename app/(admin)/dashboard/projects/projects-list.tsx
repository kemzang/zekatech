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
  imageUrls?: string | null;
  active?: boolean;
};

export function ProjectsList({
  projects,
}: {
  projects: Project[];
}) {
  async function deleteProject(id: string) {
    if (!confirm("Désactiver ce projet ? Il ne sera plus affiché sur le site.")) return;
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
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                {(() => {
                  const urls = p.imageUrls ? (typeof p.imageUrls === "string" ? JSON.parse(p.imageUrls) : p.imageUrls) : [];
                  const first = Array.isArray(urls) ? urls[0] : null;
                  return first ? (
                    <div className="size-12 shrink-0 overflow-hidden rounded border border-border bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={first} alt="" className="size-full object-cover" />
                    </div>
                  ) : null;
                })()}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{p.title}</p>
                    {p.active === false && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                        Inactif
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {p.slug} · {p.statusLabel}
                  </p>
                </div>
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
