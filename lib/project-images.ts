/**
 * Project.imageUrls est stocké en JSON sérialisé (colonne Text).
 * Toute lecture passe par ici : une valeur malformée ne doit jamais faire
 * planter un rendu.
 */
export function parseImageUrls(
  imageUrls?: string | null,
  imageUrl?: string | null
): string[] {
  if (imageUrls) {
    try {
      const parsed: unknown = JSON.parse(imageUrls);
      if (Array.isArray(parsed)) {
        const urls = parsed.filter((u): u is string => typeof u === "string" && !!u);
        if (urls.length) return urls;
      }
    } catch {
      // valeur corrompue : on retombe sur imageUrl
    }
  }
  return imageUrl ? [imageUrl] : [];
}

export function serializeImageUrls(urls: string[]): string | null {
  return urls.length ? JSON.stringify(urls) : null;
}
