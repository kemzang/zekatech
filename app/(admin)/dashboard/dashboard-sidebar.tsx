"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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

const nav = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projets", icon: FolderKanban },
  { href: "/dashboard/contacts", label: "Demandes contact", icon: Mail },
  { href: "/dashboard/newsletter", label: "Newsletter", icon: Newspaper },
  { href: "/dashboard/partners", label: "Partenaires", icon: Users },
  { href: "/dashboard/services", label: "Services", icon: Wrench },
];

export function DashboardSidebar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  function handleLogout() {
    setShowLogoutModal(false);
    signOut({ callbackUrl: "/" });
  }

  return (
    <>
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
          <Button
            variant="ghost"
            onClick={() => setShowLogoutModal(true)}
            className="mt-2 w-full justify-start gap-2 text-sm text-muted-foreground hover:bg-accent/10 hover:text-foreground"
          >
            <LogOut className="size-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Modal de confirmation de déconnexion */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowLogoutModal(false)}>
          <div className="bg-surface border border-border rounded-lg p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-foreground mb-2">Confirmer la déconnexion</h2>
            <p className="text-muted-foreground mb-6">
              Êtes-vous sûr de vouloir vous déconnecter ?
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
