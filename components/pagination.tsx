import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  pageCount: number;
  basePath: string;
  total: number;
  label: string;
};

export function Pagination({
  page,
  pageCount,
  basePath,
  total,
  label,
}: PaginationProps) {
  if (pageCount <= 1) {
    return (
      <p className="mt-4 text-sm text-muted-foreground">
        {total} {label}
      </p>
    );
  }
  return (
    <nav
      className="mt-6 flex items-center justify-between gap-4"
      aria-label="Pagination"
    >
      <p className="text-sm text-muted-foreground">
        {total} {label} · page {page} sur {pageCount}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild disabled={page <= 1}>
          <Link
            href={`${basePath}?page=${page - 1}`}
            aria-disabled={page <= 1}
            tabIndex={page <= 1 ? -1 : undefined}
            className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
          >
            <ChevronLeft className="size-4" />
            Précédent
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link
            href={`${basePath}?page=${page + 1}`}
            aria-disabled={page >= pageCount}
            tabIndex={page >= pageCount ? -1 : undefined}
            className={
              page >= pageCount ? "pointer-events-none opacity-50" : undefined
            }
          >
            Suivant
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>
    </nav>
  );
}

/** Normalise le paramètre ?page= (1 par défaut, jamais hors bornes). */
export function resolvePage(raw: string | string[] | undefined, pageCount: number) {
  const value = Number(Array.isArray(raw) ? raw[0] : raw);
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.min(Math.trunc(value), Math.max(pageCount, 1));
}
