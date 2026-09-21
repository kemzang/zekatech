import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Jamais de mot de passe en dur : il vient de l'environnement. En dehors du
  // developpement, l'absence de ADMIN_PASSWORD interrompt le seed.
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@zekatech.com").toLowerCase();
  const rawPassword = process.env.ADMIN_PASSWORD;
  if (!rawPassword && process.env.NODE_ENV === "production") {
    throw new Error(
      "ADMIN_PASSWORD doit être défini pour seeder un compte administrateur."
    );
  }
  if (!rawPassword) {
    console.warn(
      "[seed] ADMIN_PASSWORD absent : mot de passe de développement 'change-me-1234' utilisé."
    );
  }
  const adminPassword = await bcrypt.hash(rawPassword ?? "change-me-1234", 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: adminPassword,
      name: "Admin ZekaTech",
      role: "ADMIN",
    },
  });

  const services = [
    { name: "Développement Web", slug: "developpement-web", description: "Sites et applications web sur mesure.", icon: "globe", order: 0 },
    { name: "Développement Mobile", slug: "developpement-mobile", description: "Applications iOS et Android natives ou cross-platform.", icon: "smartphone", order: 1 },
    { name: "API & Backend", slug: "api-backend", description: "Conception et développement d'APIs robustes.", icon: "server", order: 2 },
    { name: "Conseil & Architecture", slug: "conseil-architecture", description: "Audit technique et architecture logicielle.", icon: "layout", order: 3 },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }

  const projects = [
    { title: "Portfolio Client X", slug: "portfolio-client-x", description: "Site vitrine responsive avec CMS.", status: "REALISE" as const, order: 0 },
    { title: "App Mobile E-commerce", slug: "app-mobile-ecommerce", description: "Application mobile React Native.", status: "EN_COURS" as const, order: 1 },
    { title: "Dashboard Analytics", slug: "dashboard-analytics", description: "Tableau de bord temps réel.", status: "REALISE" as const, order: 2 },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  const partnerCount = await prisma.partner.count();
  if (partnerCount === 0) {
    await prisma.partner.createMany({
      data: [
        { name: "Partner One", link: "https://example.com", order: 0 },
        { name: "Partner Two", link: "https://example.com", order: 1 },
      ],
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
