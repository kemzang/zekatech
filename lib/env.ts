/**
 * Vérification des variables d'environnement critiques.
 *
 * Sans NEXTAUTH_SECRET, getToken() renvoie toujours null : le proxy redirige
 * alors tout le monde vers /login sans message d'erreur explicite. Mieux vaut
 * échouer bruyamment au démarrage.
 */
const REQUIRED = ["DATABASE_URL", "NEXTAUTH_SECRET"] as const;

export function assertEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length === 0) return;
  const message = `Variables d'environnement manquantes : ${missing.join(", ")}. Copiez .env.example vers .env.`;
  if (process.env.NODE_ENV === "production") throw new Error(message);
  console.warn(`[env] ${message}`);
}
