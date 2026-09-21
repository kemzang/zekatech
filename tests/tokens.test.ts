import { describe, expect, it } from "vitest";
import { generateResetToken, hashToken, safeEquals } from "@/lib/tokens";

describe("jetons de réinitialisation", () => {
  it("ne stocke jamais le jeton en clair", () => {
    const { token, tokenHash } = generateResetToken();
    expect(tokenHash).not.toBe(token);
    expect(tokenHash).toHaveLength(64);
    expect(hashToken(token)).toBe(tokenHash);
  });

  it("produit un jeton différent à chaque appel", () => {
    expect(generateResetToken().token).not.toBe(generateResetToken().token);
  });

  it("compare sans fuite de longueur", () => {
    expect(safeEquals("abc", "abc")).toBe(true);
    expect(safeEquals("abc", "abd")).toBe(false);
    expect(safeEquals("abc", "abcd")).toBe(false);
  });
});
