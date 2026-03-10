"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Clock } from "lucide-react";

type Service = { id: string; name: string };
type ContactRequest = {
  id: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
  service: { name: string };
};

export default function ContactPage() {
  const { data: session, status } = useSession();
  const [services, setServices] = useState<Service[]>([]);
  const [history, setHistory] = useState<ContactRequest[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setServices(data);
      })
      .catch(() => {});

    // Charger l'historique
    fetch("/api/user/contacts")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setHistory(data);
      })
      .catch(() => {});
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId,
        subject: subject || undefined,
        message,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setSubject("");
      setMessage("");
      setServiceId("");
      // Recharger l'historique
      fetch("/api/user/contacts")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setHistory(data);
        })
        .catch(() => {});
    } else {
      setError(data.error?.message || data.error || "Erreur lors de l'envoi.");
    }
  }

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4">
        <p className="text-muted-foreground">
          {status === "loading" ? "Chargement..." : "Redirection..."}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      {/* Formulaire de contact */}
      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle>Nouveau message</CardTitle>
          <CardDescription>
            Décrivez votre besoin et le type de service souhaité.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="mb-4 rounded-md bg-green-500/10 p-3 text-sm text-green-500">
              ✅ Message envoyé avec succès!
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="service">Type de service *</Label>
              <Select value={serviceId} onValueChange={setServiceId} required>
                <SelectTrigger id="service" className="bg-background border-border">
                  <SelectValue placeholder="Choisir un service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Objet du message</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Développement d'une application mobile"
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Décrivez votre projet ou demande..."
                required
                rows={6}
                className="bg-background border-border resize-none"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Envoi en cours..." : "Envoyer le message"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Bouton flottant pour ouvrir les messages */}
      <button
        onClick={() => setShowHistory(true)}
        className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-primary px-6 py-4 text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
        aria-label="Voir mes messages"
      >
        <MessageSquare className="size-5" />
        <span className="font-medium">Mes messages</span>
        {history.filter((m) => !m.read).length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
            {history.filter((m) => !m.read).length}
          </span>
        )}
      </button>

      {/* Drawer (panneau latéral) pour l'historique */}
      {showHistory && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowHistory(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-surface border-l border-border shadow-2xl overflow-hidden flex flex-col">
            {/* Header du drawer */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Mes messages</h2>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="rounded-full p-2 hover:bg-accent transition-colors"
                aria-label="Fermer"
              >
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Liste des messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <MessageSquare className="size-16 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">
                    Aucun message envoyé pour le moment
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-lg border p-4 transition-colors ${
                        item.read
                          ? "border-border bg-background hover:bg-accent/5"
                          : "border-primary/30 bg-primary/5 hover:bg-primary/10"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {item.subject || "Sans objet"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.service.name}
                          </p>
                        </div>
                        {!item.read && (
                          <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground font-medium">
                            Nouveau
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {item.message}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {new Date(item.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
