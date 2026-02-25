import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { NewsletterExport } from "./newsletter-export";

export default async function DashboardNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">
        Abonnés newsletter
      </h1>
      <p className="mt-1 text-muted-foreground">
        {subscribers.length} abonné(s). Export CSV ci-dessous.
      </p>
      <div className="mt-4">
        <NewsletterExport emails={subscribers.map((s) => s.email)} />
      </div>
      <div className="mt-6 space-y-2">
        {subscribers.map((s) => (
          <Card key={s.id} className="border-border bg-surface">
            <CardContent className="flex items-center justify-between p-3">
              <span className="text-foreground">{s.email}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(s.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
