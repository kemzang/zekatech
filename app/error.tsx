"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold text-foreground">
        Une erreur est survenue
      </h1>
      <p className="mt-2 text-muted-foreground">
        La page n&apos;a pas pu s&apos;afficher. Réessayez dans un instant.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-muted-foreground">
          Référence : {error.digest}
        </p>
      )}
      <Button className="mt-6" onClick={reset}>
        Réessayer
      </Button>
    </div>
  );
}
