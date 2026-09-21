import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/slugify";

describe("slugify", () => {
  it("retire les accents et la ponctuation", () => {
    expect(slugify("Développement Web & Mobile !")).toBe(
      "developpement-web-mobile"
    );
  });

  it("ne laisse pas de tiret en début ou en fin", () => {
    expect(slugify("  --API & Backend--  ")).toBe("api-backend");
  });

  it("produit une valeur acceptée par le schéma des API", () => {
    expect(/^[a-z0-9-]+$/.test(slugify("Refonte SITE 2026"))).toBe(true);
  });
});
