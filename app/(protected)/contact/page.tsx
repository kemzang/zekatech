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
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="grid gap-6 lg:grid-cols-2">
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

        {/* Historique des messages */}
        <Card className="border-border bg-surface">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="size-5" />
                  Mes messages
                </CardTitle>
                <CardDescription>
                  Historique de vos demandes de contact
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? "Masquer" : "Afficher"}
              </Button>
            </div>
          </CardHeader>
          {showHistory && (
            <CardContent>
              {history.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Aucun message envoyé pour le moment
                </p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-lg border p-3 ${
                        item.read
                          ? "border-border bg-background"
                          : "border-primary/30 bg-primary/5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">
                            {item.subject || "Sans objet"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.service.name}
                          </p>
                        </div>
                        {!item.read && (
                          <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                            Nouveau
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
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
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
