import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderKanban, Mail, Newspaper, Users } from "lucide-react";

export default async function DashboardPage() {
  const [projectsCount, contactsCount, newsletterCount, partnersCount] =
    await Promise.all([
      prisma.project.count(),
      prisma.contactRequest.count(),
      prisma.newsletterSubscriber.count({ where: { active: true } }),
      prisma.partner.count(),
    ]);

  const unreadContacts = await prisma.contactRequest.count({
    where: { read: false },
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
    </div>
  );
}
