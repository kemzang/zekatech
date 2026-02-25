import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Globe, Smartphone, Server, Code2 } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  globe: Globe,
  smartphone: Smartphone,
  server: Server,
  layout: Code2,
};

export const metadata = {
  title: "Services | ZekaTech",
  description: "Développement web, mobile, API et conseil.",
};

export default async function ServicesPage() {
  let services: Awaited<ReturnType<typeof prisma.service.findMany>> = [];
  try {
    services = await prisma.service.findMany({
      orderBy: { order: "asc" },
    });
  } catch {
    // Base de données indisponible
  }
  type ServiceItem = (typeof services)[number];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-foreground">Services</h1>
        <p className="mt-2 text-muted-foreground">
          Développement web, applications mobiles, APIs et accompagnement
          technique.
        </p>
      </div>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
        {services.map((s: ServiceItem) => {
          const Icon = iconMap[s.icon ?? "layout"] ?? Code2;
          return (
            <Card
              key={s.id}
              className="border-border bg-surface"
            >
              <CardHeader>
                <Icon className="size-10 text-primary" />
                <CardTitle className="text-xl">{s.name}</CardTitle>
                <CardDescription className="text-base">
                  {s.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
