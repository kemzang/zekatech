"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useToast } from "@/components/ui/toast";

type Partner = {
  id: string;
  name: string;
  logoUrl: string | null;
  link: string | null;
  order: number;
  active?: boolean;
};

export function PartnersList({ partners }: { partners: Partner[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function confirmDelete() {
    const id = pendingId;
    setPendingId(null);
    if (!id) return;
    const res = await fetch(`/api/admin/partners/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Partenaire désactivé.");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast(data.error || "La désactivation a échoué.", "error");
    }
  }

  return (
    <>
      <ConfirmDialog
        open={pendingId !== null}
        title="Désactiver ce partenaire ?"
        description="Il ne sera plus affiché sur le site. Vous pourrez le réactiver depuis sa page d'édition."
        confirmLabel="Désactiver"
        onConfirm={confirmDelete}
        onCancel={() => setPendingId(null)}
      />
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
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{p.name}</p>
                  {p.active === false && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      Inactif
                    </span>
                  )}
                </div>
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
                  onClick={() => setPendingId(p.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
      </div>
    </>
  );
}
