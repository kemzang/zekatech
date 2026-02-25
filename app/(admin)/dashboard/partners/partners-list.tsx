"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";

type Partner = {
  id: string;
  name: string;
  logoUrl: string | null;
  link: string | null;
  order: number;
};

export function PartnersList({ partners }: { partners: Partner[] }) {
  async function deletePartner(id: string) {
    if (!confirm("Supprimer ce partenaire ?")) return;
    const res = await fetch(`/api/admin/partners/${id}`, { method: "DELETE" });
    if (res.ok) window.location.reload();
  }

  return (
    <div className="space-y-2">
      {partners.length === 0 ? (
        <p className="text-muted-foreground">Aucun partenaire.</p>
      ) : (
        partners.map((p) => (
          <Card key={p.id} className="border-border bg-surface">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {p.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.logoUrl}
                    alt=""
                    className="h-8 w-8 object-contain"
                  />
                ) : null}
                <div>
                  <p className="font-medium text-foreground">{p.name}</p>
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {p.link}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/dashboard/partners/${p.id}/edit`}>
                    <Pencil className="size-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => deletePartner(p.id)}
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
