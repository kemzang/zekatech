import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { ContactsList } from "./contacts-list";

export default async function DashboardContactsPage() {
  const contacts = await prisma.contactRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true, name: true } },
      service: { select: { name: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">
        Demandes de contact
      </h1>
      <p className="mt-1 text-muted-foreground">
        Messages reçus via le formulaire de contact.
      </p>
      <div className="mt-6">
        <ContactsList
          contacts={contacts.map((c) => ({
            ...c,
            createdAt: c.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
