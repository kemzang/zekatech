import Link from "next/link";
import { Logo } from "@/components/logo";

const links = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projets" },
  { href: "/partners", label: "Partenaires" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface" role="contentinfo">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="text-foreground hover:opacity-90 transition-opacity">
            <Logo size="sm" />
          </Link>
          <nav className="flex flex-wrap gap-6">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground md:text-left">
          Développement web, mobile et conseil. &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
