import { createHash, randomBytes, timingSafeEqual } from "crypto";

/**
 * Les jetons de réinitialisation ne sont jamais stockés en clair : la base ne
 * contient que leur empreinte SHA-256. Une fuite de la table ne permet donc pas
 * de prendre la main sur un compte.
 */
export function generateResetToken() {
  const token = randomBytes(32).toString("hex");
  return { token, tokenHash: hashToken(token) };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function safeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
