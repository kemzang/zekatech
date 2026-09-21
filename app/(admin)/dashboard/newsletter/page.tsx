import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination, resolvePage } from "@/components/pagination";
import { NewsletterExport } from "./newsletter-export";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

export default async function DashboardNewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const total = await prisma.newsletterSubscriber.count({
    where: { active: true },
  });
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const page = resolvePage((await searchParams).page, pageCount);

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">
        Abonnés newsletter
      </h1>
      <p className="mt-1 text-muted-foreground">
        {total} abonné(s). L&apos;export CSV contient la liste complète.
      </p>
      <div className="mt-4">
        <NewsletterExport total={total} />
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
      <Pagination
        page={page}
        pageCount={pageCount}
        basePath="/dashboard/newsletter"
        total={total}
        label="abonné(s)"
      />
    </div>
  );
}
