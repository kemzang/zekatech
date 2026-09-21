import { AlertCircle } from "lucide-react";

/**
 * Les pages publiques n'échouent pas quand la base est injoignable, mais elles
 * ne doivent pas non plus faire croire à un catalogue vide.
 */
export function DataUnavailable({ what }: { what: string }) {
  return (
    <div
      className="mx-auto mt-8 flex max-w-md items-start gap-3 rounded-lg border border-border bg-surface p-4"
      role="status"
    >
      <AlertCircle className="mt-0.5 size-5 shrink-0 text-secondary" aria-hidden />
      <p className="text-sm text-muted-foreground">
        {what} momentanément indisponibles. Réessayez dans quelques instants.
      </p>
    </div>
  );
}
