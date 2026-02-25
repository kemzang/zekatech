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
  CardFooter,
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

type Service = { id: string; name: string };

export default function ContactPage() {
  const { data: session, status } = useSession();
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setServices(data);
      })
      .catch(() => {});
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
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
    <div className="container mx-auto max-w-xl px-4 py-12">
      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <CardDescription>
            Décrivez votre besoin et le type de service souhaité. Vous êtes
            connecté en tant que {session?.user?.email}.
          </CardDescription>
        </CardHeader>
        {success ? (
          <CardContent>
            <p className="text-primary">
              Message envoyé. Je vous recontacterai rapidement.
            </p>
          </CardContent>
        ) : (
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="service">Type de service</Label>
                <Select
                  value={serviceId}
                  onValueChange={setServiceId}
                  required
                >
                  <SelectTrigger
                    id="service"
                    className="bg-background border-border"
                  >
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
                <Label htmlFor="subject">Objet (optionnel)</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Objet du message"
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre projet ou demande..."
                  required
                  rows={5}
                  className="bg-background border-border resize-none"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Envoi..." : "Envoyer"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
