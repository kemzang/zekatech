import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PartnersList } from "./partners-list";

export default async function DashboardPartnersPage() {
  const partners = await prisma.partner.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Partenaires</h1>
        <Button asChild>
          <Link href="/dashboard/partners/new">
            <Plus className="size-4" />
            Nouveau
          </Link>
        </Button>
      </div>
      <p className="mt-1 text-muted-foreground">
        Gérer les partenaires affichés sur le site.
      </p>
      <div className="mt-6">
        <PartnersList partners={partners} />
      </div>
    </div>
  );
}
