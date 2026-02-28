"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
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
import { ProjectImagePicker } from "@/components/project-image-picker";
import { ProjectVideoPicker } from "@/components/project-video-picker";

export default function NewProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"REALISE" | "EN_COURS" | "AUTRE">("REALISE");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function slugFromTitle() {
    setSlug(
      title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug: slug || undefined,
        description: description || undefined,
        status,
        imageUrls: imageUrls.length ? imageUrls : undefined,
        videoUrl: videoUrl || undefined,
        link: link || undefined,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard/projects");
      router.refresh();
    } else {
      setError(data.error || "Erreur.");
    }
  }

  return (
    <div>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/projects">← Projets</Link>
      </Button>
      <Card className="mt-4 max-w-xl border-border bg-surface">
        <CardHeader>
          <CardTitle>Nouveau projet</CardTitle>
          <CardDescription>Ajouter un projet affiché sur le site.</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={slugFromTitle}
                required
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="mon-projet"
                required
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={status} onValueChange={(v: "REALISE" | "EN_COURS" | "AUTRE") => setStatus(v)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REALISE">Réalisé</SelectItem>
                  <SelectItem value="EN_COURS">En cours</SelectItem>
                  <SelectItem value="AUTRE">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ProjectImagePicker value={imageUrls} onChange={setImageUrls} disabled={loading} />
            <ProjectVideoPicker value={videoUrl} onChange={setVideoUrl} disabled={loading} />
            <div className="space-y-2">
              <Label htmlFor="link">Lien projet (optionnel)</Label>
              <Input
                id="link"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="bg-background border-border"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
