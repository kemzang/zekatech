import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderKanban, Mail, Newspaper, Users } from "lucide-react";
import { PROJECT_STATUS_ORDER, projectStatusLabel } from "@/lib/project-status";
import { DashboardCharts } from "./dashboard-charts";

export const dynamic = "force-dynamic";

const MOIS = [
  "Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin",
  "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc.",
];

function formatMonth(d: Date) {
  return `${MOIS[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
}

/** Une ligne par mois renvoyée par les agrégations SQL. */
type MonthRow = { month: Date; count: number };

export default async function DashboardPage() {
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  // Tout est agrégé côté base : aucune table n'est chargée en mémoire pour
  // être comptée en JavaScript.
  const [
    projectsCount,
    contactsCount,
    newsletterCount,
    partnersCount,
    unreadContacts,
    statusGroups,
    serviceGroups,
    services,
    contactsPerMonth,
    subscribersPerMonth,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.contactRequest.count(),
    prisma.newsletterSubscriber.count({ where: { active: true } }),
    prisma.partner.count(),
    prisma.contactRequest.count({ where: { read: false } }),
    prisma.project.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.contactRequest.groupBy({ by: ["serviceId"], _count: { _all: true } }),
    prisma.service.findMany({ select: { id: true, name: true } }),
    prisma.$queryRaw<MonthRow[]>`
      SELECT date_trunc('month', "created_at") AS month, COUNT(*)::int AS count
      FROM "ContactRequest"
      WHERE "created_at" >= ${twelveMonthsAgo}
      GROUP BY 1
      ORDER BY 1
    `,
    prisma.$queryRaw<MonthRow[]>`
      SELECT date_trunc('month', "created_at") AS month, COUNT(*)::int AS count
      FROM "NewsletterSubscriber"
      WHERE "active" = true
      GROUP BY 1
      ORDER BY 1
    `,
  ]);

  const statusCount = new Map(statusGroups.map((g) => [g.status, g._count._all]));
  const projectsByStatus = PROJECT_STATUS_ORDER.map((status) => ({
    name: projectStatusLabel(status),
    count: statusCount.get(status) ?? 0,
  }));

  // 12 derniers mois, trous compris.
  const monthKeys: string[] = [];
  for (let i = 11; i >= 0; i--) {
    monthKeys.push(
      formatMonth(new Date(now.getFullYear(), now.getMonth() - i, 1))
    );
  }
  const contactsPerMonthMap = new Map(
    contactsPerMonth.map((r) => [formatMonth(new Date(r.month)), r.count])
  );
  const contactsByMonth = monthKeys.map((month) => ({
    month,
    demandes: contactsPerMonthMap.get(month) ?? 0,
  }));

  const serviceNames = new Map(services.map((s) => [s.id, s.name]));
  const contactsByService = serviceGroups
    .map((g) => ({
      name: serviceNames.get(g.serviceId) ?? "Inconnu",
      count: g._count._all,
    }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count);

  const contactsReadUnread = [
    { name: "Lus", value: contactsCount - unreadContacts },
    { name: "Non lus", value: unreadContacts },
  ];

  let cumul = 0;
  const newsletterByMonth = subscribersPerMonth.map((r) => {
    cumul += r.count;
    return { month: formatMonth(new Date(r.month)), abonnes: cumul };
  });

  const cards = [
    {
      title: "Projets",
      value: projectsCount,
      href: "/dashboard/projects",
      icon: FolderKanban,
    },
    {
      title: "Demandes de contact",
      value: contactsCount,
      sub: unreadContacts ? `${unreadContacts} non lues` : undefined,
      href: "/dashboard/contacts",
      icon: Mail,
    },
    {
      title: "Abonnés newsletter",
      value: newsletterCount,
      href: "/dashboard/newsletter",
      icon: Newspaper,
    },
    {
      title: "Partenaires",
      value: partnersCount,
      href: "/dashboard/partners",
      icon: Users,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">
        Vue d&apos;ensemble
      </h1>
      <p className="mt-1 text-muted-foreground">
        Gérez les contenus et demandes du site.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.href} className="border-border bg-surface">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {c.title}
              </CardTitle>
              <c.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{c.value}</p>
              {c.sub && <p className="text-xs text-muted-foreground">{c.sub}</p>}
              <Button variant="ghost" size="sm" className="mt-2" asChild>
                <Link href={c.href}>Voir</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <DashboardCharts
        projectsByStatus={projectsByStatus}
        contactsByMonth={contactsByMonth}
        contactsByService={contactsByService}
        contactsReadUnread={contactsReadUnread}
        newsletterByMonth={newsletterByMonth}
      />
    </div>
  );
}
