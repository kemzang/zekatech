import { prisma } from "@/lib/prisma";
import { Pagination, resolvePage } from "@/components/pagination";
import { ContactsList } from "./contacts-list";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function DashboardContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const total = await prisma.contactRequest.count();
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const page = resolvePage((await searchParams).page, pageCount);

  const contacts = await prisma.contactRequest.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
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
      <Pagination
        page={page}
        pageCount={pageCount}
        basePath="/dashboard/contacts"
        total={total}
        label="demande(s)"
      />
    </div>
  );
}
