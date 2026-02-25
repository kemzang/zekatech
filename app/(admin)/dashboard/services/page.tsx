import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { Card, CardContent } from "@/components/ui/card";

export default async function DashboardServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Services</h1>
      <p className="mt-1 text-muted-foreground">
        Types de services proposés (définis en base). Modifiables via le seed ou
        la BDD.
      </p>
      <div className="mt-6 space-y-2">
        {services.map((s) => (
          <Card key={s.id} className="border-border bg-surface">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-foreground">{s.name}</p>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
              <span className="text-xs text-muted-foreground">{s.slug}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
