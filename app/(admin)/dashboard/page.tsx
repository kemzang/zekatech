import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderKanban, Mail, Newspaper, Users } from "lucide-react";
import { DashboardCharts } from "./dashboard-charts";

const MOIS: Record<number, string> = {
  1: "Janv.", 2: "Févr.", 3: "Mars", 4: "Avr.", 5: "Mai", 6: "Juin",
  7: "Juil.", 8: "Août", 9: "Sept.", 10: "Oct.", 11: "Nov.", 12: "Déc.",
};

function formatMonth(d: Date) {
  return `${MOIS[d.getMonth() + 1]} ${String(d.getFullYear()).slice(-2)}`;
}

export default async function DashboardPage() {
  const [
    projectsCount,
    contactsCount,
    newsletterCount,
    partnersCount,
    projects,
    contacts,
    subscribers,
    services,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.contactRequest.count(),
    prisma.newsletterSubscriber.count({ where: { active: true } }),
    prisma.partner.count(),
    prisma.project.findMany({ select: { status: true } }),
    prisma.contactRequest.findMany({
      select: {
        createdAt: true,
        read: true,
        serviceId: true,
        service: { select: { name: true } },
      },
    }),
    prisma.newsletterSubscriber.findMany({
      where: { active: true },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.service.findMany({ select: { id: true, name: true } }),
  ]);

  const unreadContacts = await prisma.contactRequest.count({
    where: { read: false },
  });

  // Projets par statut
  const statusCount: Record<string, number> = {};
  for (const p of projects) {
    statusCount[p.status] = (statusCount[p.status] ?? 0) + 1;
  }
  const projectsByStatus = ["REALISE", "EN_COURS", "AUTRE"].map((s) => ({
    name: s === "REALISE" ? "Réalisé" : s === "EN_COURS" ? "En cours" : "Autre",
    count: statusCount[s] ?? 0,
  }));

  // Contacts par mois (12 derniers mois)
  const now = new Date();
  const monthKeys: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthKeys.push(formatMonth(d));
  }
  const contactCountByMonth: Record<string, number> = Object.fromEntries(
    monthKeys.map((k) => [k, 0])
  );
  for (const c of contacts) {
    const key = formatMonth(c.createdAt);
    if (key in contactCountByMonth) contactCountByMonth[key]++;
  }
  const contactsByMonth = monthKeys.map((month) => ({
    month,
    demandes: contactCountByMonth[month] ?? 0,
  }));

  // Contacts par service
  const byService: Record<string, number> = {};
  for (const c of contacts) {
    const name = c.service?.name ?? "Inconnu";
    byService[name] = (byService[name] ?? 0) + 1;
  }
  const contactsByService = services
    .map((s) => ({ name: s.name, count: byService[s.name] ?? 0 }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count);
  if (contactsByService.length === 0 && contacts.length > 0) {
    contactsByService.push({
      name: "Autre",
      count: contacts.length,
    });
  }

  // Lus / non lus
  const read = contacts.filter((c) => c.read).length;
  const unread = contacts.length - read;
  const contactsReadUnread = [
    { name: "Lus", value: read },
    { name: "Non lus", value: unread },
  ];

  // Newsletter : évolution cumulative par mois
  const subByMonth: Record<string, number> = {};
  const subMonthKeys: { y: number; m: number }[] = [];
  for (const s of subscribers) {
    const d = s.createdAt;
    const key = formatMonth(d);
    subByMonth[key] = (subByMonth[key] ?? 0) + 1;
    subMonthKeys.push({ y: d.getFullYear(), m: d.getMonth() });
  }
  subMonthKeys.sort((a, b) => (a.y !== b.y ? a.y - b.y : a.m - b.m));
  const seen = new Set<string>();
  const sortedMonths: string[] = [];
  for (const { y, m } of subMonthKeys) {
    const d = new Date(y, m, 1);
    const key = formatMonth(d);
    if (!seen.has(key)) {
      seen.add(key);
      sortedMonths.push(key);
    }
  }
  let cumul = 0;
  const newsletterByMonth = sortedMonths.map((month) => {
    cumul += subByMonth[month] ?? 0;
    return { month, abonnes: cumul };
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
              {c.sub && (
                <p className="text-xs text-muted-foreground">{c.sub}</p>
              )}
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
