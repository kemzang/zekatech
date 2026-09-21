/** URL publique canonique, utilisée pour les metadata, le sitemap et robots.txt. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXTAUTH_URL ??
  "http://localhost:3000"
).replace(/\/$/, "");

export const siteName = "ZekaTech";
export const siteDescription =
  "Services de développement web, mobile, API et conseil. Projets réalisés et en cours.";
