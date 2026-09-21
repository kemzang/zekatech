"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  UserPlus,
  UserCircle,
  X,
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
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

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
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Navigation principale"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent/10 hover:text-foreground ${
                  isActive(item.href) ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
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
                  <Link href="/profile">
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

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>

        {/* Navigation mobile : sans elle, aucun lien n'etait atteignable
            sous 768px, la nav etant simplement masquee. */}
        {menuOpen && (
          <div
            id="mobile-nav"
            className="border-t border-border bg-background md:hidden"
          >
            <nav
              className="container mx-auto flex flex-col px-4 py-2"
              aria-label="Navigation mobile"
              onClick={() => setMenuOpen(false)}
            >
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`rounded-md px-3 py-3 text-sm transition-colors hover:bg-accent/10 ${
                    isActive(item.href)
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-border pb-2 pt-3">
                {session ? (
                  <>
                    {session.user.role === "ADMIN" && (
                      <Button variant="outline" size="sm" asChild className="w-full justify-start">
                        <Link href="/dashboard">
                          <LayoutDashboard className="size-4" />
                          Dashboard
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                      <Link href="/profile">
                        <UserCircle className="size-4" />
                        Mon profil
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setShowLogoutModal(true)}
                    >
                      <LogOut className="size-4" />
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                      <Link href="/login">
                        <LogIn className="size-4" />
                        Connexion
                      </Link>
                    </Button>
                    <Button size="sm" asChild className="w-full justify-start">
                      <Link href="/register">
                        <UserPlus className="size-4" />
                        Inscription
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
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
