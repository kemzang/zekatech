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
      where: { active: true },
      orderBy: { order: "asc" },
    });
  } catch {
    // Base de données indisponible
  }
  type ServiceItem = (typeof services)[number];

  return (
    <div>
      {/* Hero avec image background */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop"
            alt="Coding workspace"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/75 to-primary/40" />
        </div>
        
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-lg">
              Services
            </h1>
            <p className="mt-4 text-lg text-gray-200 md:text-xl">
              Développement web, applications mobiles, APIs et accompagnement technique.
            </p>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
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
      </section>
    </div>
  );
}
