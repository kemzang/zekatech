"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NewsletterBlock() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setStatus("success");
      setEmail("");
      setMessage("Merci, vous êtes inscrit.");
    } else {
      setStatus("error");
      setMessage(data.error || "Une erreur est survenue.");
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-lg border border-border bg-surface p-6">
      <h2 className="text-xl font-semibold text-foreground">
        Restez informé
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Inscrivez-vous pour recevoir les actualités et nouveautés.
      </p>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <div className="space-y-2">
          <Label htmlFor="newsletter-email">Email</Label>
          <Input
            id="newsletter-email"
            type="email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading"}
            className="bg-background border-border"
          />
        </div>
        {message && (
          <p
            className={`text-sm ${status === "success" ? "text-primary" : "text-destructive"}`}
            role="alert"
          >
            {message}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={status === "loading"}>
          {status === "loading" ? "Inscription..." : "S'inscrire"}
        </Button>
      </form>
    </div>
  );
}
