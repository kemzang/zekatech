"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ProjectCardProps = {
  title: string;
  description: string | null;
  status: string;
  statusLabel: string;
  link: string | null;
  videoUrl: string | null;
  imageUrl: string | null;
  imageUrls: string | null;
};

function parseImages(imageUrls: string | null, imageUrl: string | null): string[] {
  if (!imageUrls && !imageUrl) return [];
  const parsed = imageUrls
    ? typeof imageUrls === "string"
      ? (JSON.parse(imageUrls) as string[])
      : (imageUrls as string[])
    : [];
  if (Array.isArray(parsed) && parsed.length) return parsed;
  if (imageUrl) return [imageUrl];
  return [];
}

export function ProjectCard({
  title,
  description,
  status,
  statusLabel,
  link,
  videoUrl,
  imageUrl,
  imageUrls,
}: ProjectCardProps) {
  const images = parseImages(imageUrls, imageUrl);
  const [imageIndex, setImageIndex] = useState(0);
  const hasVideo = !!videoUrl;
  const hasImages = images.length > 0;
  const hasMedia = hasVideo || hasImages;

  const goPrev = () => setImageIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  const goNext = () => setImageIndex((i) => (i >= images.length - 1 ? 0 : i + 1));

  return (
    <Card className="flex flex-col border-border bg-surface overflow-hidden">
      {hasMedia && (
        <div className="shrink-0">
          {hasVideo && (
            <div className="aspect-video w-full bg-muted">
              <video
                src={videoUrl!}
                controls
                className="h-full w-full object-contain"
                preload="metadata"
                playsInline
              >
                Votre navigateur ne lit pas la vidéo.
              </video>
            </div>
          )}
          {hasImages && (
            <div
              className={`relative w-full bg-muted ${hasVideo ? "aspect-video max-h-40" : "aspect-video"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[imageIndex]}
                alt=""
                className="h-full w-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute left-1 top-1/2 -translate-y-1/2 size-8 rounded-full opacity-80 hover:opacity-100"
                    onClick={goPrev}
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="size-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 size-8 rounded-full opacity-80 hover:opacity-100"
                    onClick={goNext}
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="size-5" />
                  </Button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setImageIndex(i)}
                        className={`size-2 rounded-full transition-colors ${
                          i === imageIndex ? "bg-primary" : "bg-white/60 hover:bg-white/80"
                        }`}
                        aria-label={`Image ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
      <CardHeader className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          <span className="shrink-0 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
            {statusLabel}
          </span>
        </div>
        <CardDescription className={hasMedia ? "line-clamp-3" : "line-clamp-4"}>
          {description || "—"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {link && (
          <Button variant="outline" size="sm" asChild>
            <a href={link} target="_blank" rel="noopener noreferrer">
              Voir le projet
            </a>
          </Button>
        )}
        {!link && !hasVideo && !hasImages && (
          <span className="text-sm text-muted-foreground">Lien à venir</span>
        )}
      </CardContent>
    </Card>
  );
}
