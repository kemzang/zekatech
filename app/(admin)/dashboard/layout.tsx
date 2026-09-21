import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { SkipLink } from "@/components/skip-link";
import { DashboardSidebar } from "./dashboard-sidebar";

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
      <SkipLink />
      <DashboardSidebar />
      <main id="main" className="flex-1 overflow-auto bg-background p-6">
        {children}
      </main>
    </div>
  );
}
