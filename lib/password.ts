import { z } from "zod";

/**
 * Politique commune à l'inscription et à la réinitialisation :
 * 10 caractères minimum, au moins une lettre et un chiffre.
 */
export const passwordSchema = z
  .string()
  .min(10, "Au moins 10 caractères")
  .max(200, "200 caractères maximum")
  .refine((v) => /[a-zA-Z]/.test(v), "Doit contenir au moins une lettre")
  .refine((v) => /[0-9]/.test(v), "Doit contenir au moins un chiffre");
