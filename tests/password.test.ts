import { describe, expect, it } from "vitest";
import { passwordSchema } from "@/lib/password";

describe("politique de mot de passe", () => {
  it("accepte un mot de passe conforme", () => {
    expect(passwordSchema.safeParse("motdepasse1").success).toBe(true);
  });

  it("refuse moins de 10 caractères", () => {
    expect(passwordSchema.safeParse("court1").success).toBe(false);
  });

  it("exige une lettre et un chiffre", () => {
    expect(passwordSchema.safeParse("1234567890").success).toBe(false);
    expect(passwordSchema.safeParse("abcdefghij").success).toBe(false);
  });
});
