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
  UserCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <div className="mb-4 flex items-center justify-between">
            <Link href="/dashboard" className="font-semibold text-foreground">
              Admin
            </Link>
            <Link href="/dashboard/profile">
              <Button variant="ghost" size="icon" className="size-8 rounded-full">
                <UserCircle className="size-5" />
              </Button>
            </Link>
          </div>
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
          <form action="/api/auth/signout" method="POST" className="mt-2">
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start gap-2 text-sm text-muted-foreground hover:bg-accent/10 hover:text-foreground"
            >
              <LogOut className="size-4" />
              Déconnexion
            </Button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-background p-6">
        {children}
      </main>
    </div>
  );
}
