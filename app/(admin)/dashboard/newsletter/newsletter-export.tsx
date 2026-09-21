import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

/**
 * L'export est généré côté serveur : la page n'affiche qu'une page d'abonnés,
 * le CSV doit contenir la liste entière.
 */
export function NewsletterExport({ total }: { total: number }) {
  if (total === 0) {
    return (
      <Button variant="outline" disabled>
        <Download className="size-4" />
        Exporter en CSV
      </Button>
    );
  }
  return (
    <Button variant="outline" asChild>
      <a href="/api/admin/newsletter?format=csv" download>
        <Download className="size-4" />
        Exporter en CSV
      </a>
    </Button>
  );
}
