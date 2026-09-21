"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useToast } from "@/components/ui/toast";

type Service = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  order: number;
  active?: boolean;
};

export function ServicesList({ services }: { services: Service[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function confirmDelete() {
    const id = pendingId;
    setPendingId(null);
    if (!id) return;
    const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Service désactivé.");
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
        title="Désactiver ce service ?"
        description="Il ne sera plus proposé sur le site. Vous pourrez le réactiver depuis sa page d'édition."
        confirmLabel="Désactiver"
        onConfirm={confirmDelete}
        onCancel={() => setPendingId(null)}
      />
      <div className="space-y-2">
      {services.length === 0 ? (
        <p className="text-muted-foreground">Aucun service.</p>
      ) : (
        services.map((s) => (
          <Card key={s.id} className="border-border bg-surface">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{s.name}</p>
                    {s.active === false && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                        Inactif
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{s.slug}</p>
                  {s.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {s.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/dashboard/services/${s.id}/edit`}>
                    <Pencil className="size-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => setPendingId(s.id)}
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
