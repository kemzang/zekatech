"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

type Contact = {
  id: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
  user: { email: string; name: string | null };
  service: { name: string };
};

export function ContactsList({ contacts }: { contacts: Contact[] }) {
  async function markRead(id: string) {
    await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    window.location.reload();
  }

  if (contacts.length === 0) {
    return <p className="text-muted-foreground">Aucune demande.</p>;
  }

  return (
    <div className="space-y-4">
      {contacts.map((c) => (
        <Card
          key={c.id}
          className={`border-border ${c.read ? "bg-surface" : "bg-surface-elevated"}`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">
                  {c.user.name ?? c.user.email} · {c.service.name}
                </p>
                <p className="font-medium text-foreground">
                  {c.subject ?? "(sans objet)"}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                  {c.message}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(c.createdAt).toLocaleString("fr-FR")}
                </p>
              </div>
              {!c.read && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markRead(c.id)}
                >
                  <Check className="size-4" />
                  Marquer lu
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
