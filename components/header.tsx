"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  UserPlus,
  UserCircle,
} from "lucide-react";
import { Logo } from "@/components/logo";

const nav = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projets" },
  { href: "/partners", label: "Partenaires" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const { data: session, status } = useSession();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  function handleLogout() {
    setShowLogoutModal(false);
    signOut({ callbackUrl: "/" });
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur" role="banner">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link href="/" className="text-foreground hover:opacity-90 transition-opacity">
            <Logo size="sm" />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {status === "loading" ? (
              <span className="text-muted-foreground text-sm">...</span>
            ) : session ? (
              <>
                {session.user.role === "ADMIN" && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="icon" asChild>
                  <Link href={session.user.role === "ADMIN" ? "/dashboard/profile" : "/profile"}>
                    <UserCircle className="size-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowLogoutModal(true)}>
                  <LogOut className="size-4" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">
                    <LogIn className="size-4" />
                    Connexion
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">
                    <UserPlus className="size-4" />
                    Inscription
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

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
