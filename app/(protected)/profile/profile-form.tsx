"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type User = {
  name?: string | null;
  email?: string | null;
};

export function ProfileForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("Profil mis à jour avec succès!");
      // Forcer la mise à jour de la session
      setTimeout(() => {
        window.location.href = window.location.href;
      }, 1500);
    } else {
      setMessage(data.error || "Erreur lors de la mise à jour");
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Le mot de passe doit contenir au moins 8 caractères");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/user/profile/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("Mot de passe modifié avec succès!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setMessage(data.error || "Erreur lors de la modification");
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-md p-3 text-sm ${
            message.includes("succès")
              ? "bg-green-500/10 text-green-500"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {message}
        </div>
      )}

      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                L&apos;email ne peut pas être modifié
              </p>
            </div>
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle>Modifier le mot de passe</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Modification..." : "Modifier le mot de passe"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
