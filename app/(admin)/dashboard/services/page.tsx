import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";
import { ServicesList } from "./services-list";

export default async function DashboardServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Services</h1>
          <p className="mt-1 text-muted-foreground">
            Types de services proposés sur le site. Modifier ou désactiver ci-dessous.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/services/new">
            <Plus className="mr-2 size-4" />
            Nouveau service
          </Link>
        </Button>
      </div>
      <div className="mt-6">
        <ServicesList services={services} />
      </div>
    </div>
  );
}
