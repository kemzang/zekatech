import { describe, expect, it } from "vitest";
import { clientIp, rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("autorise jusqu'à la limite puis refuse", () => {
    const key = `test-${Math.random()}`;
    expect(rateLimit(key, 3, 60_000).ok).toBe(true);
    expect(rateLimit(key, 3, 60_000).ok).toBe(true);
    expect(rateLimit(key, 3, 60_000).ok).toBe(true);
    const blocked = rateLimit(key, 3, 60_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("repart à zéro une fois la fenêtre écoulée", async () => {
    const key = `test-${Math.random()}`;
    expect(rateLimit(key, 1, 10).ok).toBe(true);
    expect(rateLimit(key, 1, 10).ok).toBe(false);
    await new Promise((r) => setTimeout(r, 20));
    expect(rateLimit(key, 1, 10).ok).toBe(true);
  });

  it("isole les clés entre elles", () => {
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    expect(rateLimit(a, 1, 60_000).ok).toBe(true);
    expect(rateLimit(a, 1, 60_000).ok).toBe(false);
    expect(rateLimit(b, 1, 60_000).ok).toBe(true);
  });
});

describe("clientIp", () => {
  it("prend la première IP de x-forwarded-for", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "203.0.113.5, 10.0.0.1" },
    });
    expect(clientIp(req)).toBe("203.0.113.5");
  });

  it("retombe sur unknown sans en-tête", () => {
    expect(clientIp(new Request("http://localhost"))).toBe("unknown");
  });
});
