import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { ServicesList } from "./services-list";

export default async function DashboardServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Services</h1>
      <p className="mt-1 text-muted-foreground">
        Types de services proposés sur le site. Modifier ou désactiver ci-dessous.
      </p>
      <div className="mt-6">
        <ServicesList services={services} />
      </div>
    </div>
  );
}
