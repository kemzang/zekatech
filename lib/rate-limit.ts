/**
 * Limiteur de débit en mémoire (fenêtre glissante).
 *
 * Suffisant pour une instance unique : les compteurs vivent dans le process et
 * repartent de zéro au redémarrage. Derrière plusieurs instances (scale
 * horizontal), il faut un store partagé (Redis / Upstash) — l'interface ci-
 * dessous ne change pas.
 */
type Hit = { count: number; resetAt: number };

const buckets = new Map<string, Hit>();
let lastSweep = Date.now();

function sweep(now: number) {
  // Nettoyage opportuniste pour éviter que la Map ne grossisse indéfiniment.
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, hit] of buckets) {
    if (hit.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  sweep(now);
  const hit = buckets.get(key);
  if (!hit || hit.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }
  hit.count += 1;
  const retryAfterSeconds = Math.ceil((hit.resetAt - now) / 1000);
  if (hit.count > limit) {
    return { ok: false, remaining: 0, retryAfterSeconds };
  }
  return { ok: true, remaining: limit - hit.count, retryAfterSeconds };
}

/** Identifie l'appelant : IP réelle derrière un proxy, sinon "unknown". */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Réponse 429 normalisée. */
export function tooManyRequests(result: RateLimitResult) {
  return new Response(
    JSON.stringify({
      error: `Trop de tentatives. Réessayez dans ${result.retryAfterSeconds} seconde(s).`,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(result.retryAfterSeconds),
      },
    }
  );
}
