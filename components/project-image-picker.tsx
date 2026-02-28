"use client";

import { useRef, useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";

type ProjectImagePickerProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  label?: string;
};

export function ProjectImagePicker({
  value,
  onChange,
  disabled,
  label = "Images du projet",
}: ProjectImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewFiles, setPreviewFiles] = useState<{ id: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  const removePreview = useCallback(
    (id: string) => {
      setPreviewFiles((p) => p.filter((x) => x.id !== id));
    },
    []
  );

  const removeSaved = useCallback(
    (url: string) => {
      onChange(value.filter((u) => u !== url));
    },
    [value, onChange]
  );

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    const fileArray = fileList ? Array.from(fileList) : [];
    e.target.value = "";
    if (!fileArray.length) return;

    const imageFiles = fileArray.filter((f) => f.type.startsWith("image/"));
    if (!imageFiles.length) {
      alert("Sélectionnez au moins une image (JPEG, PNG, GIF, WebP).");
      return;
    }

    const newPreviews: { id: string; url: string }[] = imageFiles.map((file, i) => ({
      id: `preview-${Date.now()}-${i}`,
      url: URL.createObjectURL(file),
    }));
    setPreviewFiles((p) => [...p, ...newPreviews]);
    setUploading(true);

    const formData = new FormData();
    imageFiles.forEach((file) => formData.append("files", file));
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.urls?.length) {
        newPreviews.forEach((p) => URL.revokeObjectURL(p.url));
        setPreviewFiles((prev) => prev.filter((x) => !newPreviews.some((n) => n.id === x.id)));
        onChange([...value, ...data.urls]);
      } else {
        newPreviews.forEach((p) => URL.revokeObjectURL(p.url));
        setPreviewFiles((prev) => prev.filter((x) => !newPreviews.some((n) => n.id === x.id)));
        alert(data.error || "Erreur upload.");
      }
    } catch {
      newPreviews.forEach((p) => URL.revokeObjectURL(p.url));
      setPreviewFiles((prev) => prev.filter((x) => !newPreviews.some((n) => n.id === x.id)));
      alert("Erreur upload.");
    } finally {
      setUploading(false);
    }
  }

  const allPreviews = [
    ...value.map((url) => ({ id: url, url, saved: true })),
    ...previewFiles.map((p) => ({ id: p.id, url: p.url, saved: false })),
  ];

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        disabled={disabled || uploading}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploading}
        className="gap-2"
      >
        <ImagePlus className="size-4" />
        {uploading ? "Upload en cours..." : "Choisir des images sur mon PC"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Plusieurs images possibles. JPEG, PNG, GIF, WebP. Max 5 Mo par fichier.
      </p>
      {allPreviews.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {allPreviews.map((item) => (
            <div
              key={item.id}
              className="relative aspect-video overflow-hidden rounded-md border border-border bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt=""
                className="h-full w-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-1 top-1 size-7"
                onClick={() =>
                  item.saved ? removeSaved(item.url) : removePreview(item.id)
                }
                aria-label="Supprimer"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
