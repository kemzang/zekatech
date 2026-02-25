import Link from "next/link";
import { Code2 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-background px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <Code2 className="size-6 text-primary" />
          ZekaTech
        </Link>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
