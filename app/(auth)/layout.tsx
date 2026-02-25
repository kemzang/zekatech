import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-background px-4 py-3">
        <Link href="/" className="text-foreground hover:opacity-90 transition-opacity">
          <Logo size="sm" />
        </Link>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
