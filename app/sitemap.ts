import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/projects`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/partners`, changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const projects = await prisma.project.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
      orderBy: { order: "asc" },
    });
    return [
      ...staticRoutes,
      ...projects.map((p) => ({
        url: `${siteUrl}/projects/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch (e) {
    console.error("[sitemap] base de données indisponible", e);
    return staticRoutes;
  }
}
