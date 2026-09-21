"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[dashboard]", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-xl font-semibold text-foreground">
        Le tableau de bord n&apos;a pas pu être chargé
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        La base de données est peut-être indisponible. Vérifiez la connexion
        puis réessayez.
      </p>
      <Button className="mt-6" onClick={reset}>
        Réessayer
      </Button>
    </div>
  );
}
