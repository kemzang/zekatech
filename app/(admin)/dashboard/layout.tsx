import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/auth";
import {
  LayoutDashboard,
  FolderKanban,
  Mail,
  Users,
  Newspaper,
  Wrench,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projets", icon: FolderKanban },
  { href: "/dashboard/contacts", label: "Demandes contact", icon: Mail },
  { href: "/dashboard/newsletter", label: "Newsletter", icon: Newspaper },
  { href: "/dashboard/partners", label: "Partenaires", icon: Users },
  { href: "/dashboard/services", label: "Services", icon: Wrench },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r border-border bg-surface">
        <div className="sticky top-0 flex flex-col gap-1 p-4">
          <Link
            href="/dashboard"
            className="mb-4 font-semibold text-foreground"
          >
            Admin
          </Link>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            className="mt-4 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent/10 hover:text-foreground"
          >
            Retour au site
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-background p-6">
        {children}
      </main>
    </div>
  );
}
