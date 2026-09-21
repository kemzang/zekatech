import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { parseImageUrls } from "@/lib/project-images";
import { projectStatusLabel } from "@/lib/project-status";
import { siteUrl } from "@/lib/site";

export const revalidate = 300;

async function getProject(slug: string) {
  try {
    return await prisma.project.findFirst({ where: { slug, active: true } });
  } catch (e) {
    console.error("[projet] base de données indisponible", e);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Projet introuvable" };

  const description =
    project.description?.slice(0, 160) ??
    `Projet ${project.title} réalisé par ZekaTech.`;
  const cover = parseImageUrls(project.imageUrls, project.imageUrl)[0];

  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description,
      url: `${siteUrl}/projects/${project.slug}`,
      ...(cover ? { images: [{ url: cover }] } : {}),
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const images = parseImageUrls(project.imageUrls, project.imageUrl);
  const statusLabel = projectStatusLabel(project.status);

  // Donnée structurée : aide les moteurs à comprendre la page projet.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description ?? undefined,
    url: `${siteUrl}/projects/${project.slug}`,
    dateModified: project.updatedAt.toISOString(),
    ...(images[0] ? { image: `${siteUrl}${images[0]}` } : {}),
    creator: { "@type": "Organization", name: "ZekaTech", url: siteUrl },
  };

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Button variant="ghost" size="sm" asChild>
        <Link href="/projects">
          <ArrowLeft className="size-4" />
          Tous les projets
        </Link>
      </Button>

      <header className="mt-4">
        <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
          {statusLabel}
        </span>
        <h1 className="mt-3 text-3xl font-bold text-foreground">
          {project.title}
        </h1>
        {project.description && (
          <p className="mt-3 whitespace-pre-wrap text-muted-foreground">
            {project.description}
          </p>
        )}
      </header>

      {project.videoUrl && (
        <div className="mt-8 overflow-hidden rounded-lg border border-border bg-muted">
          <video
            src={project.videoUrl}
            controls
            preload="metadata"
            playsInline
            className="aspect-video w-full"
          >
            Votre navigateur ne lit pas la vidéo.
          </video>
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {images.map((url, i) => (
            <div
              key={url}
              className="relative aspect-video overflow-hidden rounded-lg border border-border bg-muted"
            >
              <Image
                src={url}
                alt={`${project.title} — visuel ${i + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {project.link && (
        <div className="mt-8">
          <Button asChild>
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              Voir le projet en ligne
            </a>
          </Button>
        </div>
      )}
    </article>
  );
}
