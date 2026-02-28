"use client";

import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";

type ProjectVideoPickerProps = {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  label?: string;
};

export function ProjectVideoPicker({
  value,
  onChange,
  disabled,
  label = "Vidéo du projet",
}: ProjectVideoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("video/")) {
      if (file) alert("Sélectionnez un fichier vidéo (MP4, WebM ou MOV).");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("video", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        onChange(data.url);
        setPreviewUrl(null);
      } else {
        alert(data.error || "Erreur lors de l'upload de la vidéo.");
      }
    } catch {
      alert("Erreur lors de l'upload.");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    onChange("");
    setPreviewUrl(null);
  }

  const displayUrl = value || previewUrl;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={handleFileSelect}
        disabled={disabled || uploading}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading}
          className="gap-2"
        >
          {uploading ? (
            "Upload en cours..."
          ) : (
            <>
              <Upload className="size-4" />
              Choisir une vidéo sur mon PC
            </>
          )}
        </Button>
        {displayUrl && (
          <Button type="button" variant="ghost" size="sm" onClick={handleRemove} className="gap-1 text-destructive">
            <X className="size-4" />
            Supprimer la vidéo
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        MP4, WebM ou MOV. Max 100 Mo.
      </p>
      {displayUrl && (
        <div className="mt-3 overflow-hidden rounded-md border border-border bg-muted">
          <video
            src={displayUrl}
            controls
            className="aspect-video w-full max-w-md"
            preload="metadata"
          >
            Votre navigateur ne lit pas la vidéo.
          </video>
        </div>
      )}
    </div>
  );
}
