import { NextResponse } from "next/server";
import { getServerSession, type Session } from "next-auth";
import { authOptions } from "@/auth";

export async function requireAdmin(): Promise<Session> {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

type RouteContext<P> = { params: Promise<P> };
type AdminHandler<P> = (
  req: Request,
  ctx: RouteContext<P>,
  session: Session
) => Promise<Response> | Response;

/**
 * Garde d'accès des routes d'administration.
 *
 * Remplace le bloc `try { await requireAdmin() } catch { 401 }` répété dans
 * chaque handler, et distingue surtout les deux cas que l'ancien code
 * confondait : un visiteur non autorisé (401) et une panne de session ou de
 * base de données (503), qui remontait jusque-là comme un 401 trompeur.
 */
export function withAdmin<P = Record<string, string>>(
  handler: AdminHandler<P>
): (req: Request, ctx: RouteContext<P>) => Promise<Response> {
  return async (req, ctx) => {
    let session: Session | null;
    try {
      session = await getServerSession(authOptions);
    } catch (e) {
      console.error("[auth] session illisible", e);
      return NextResponse.json(
        { error: "Service momentanément indisponible." },
        { status: 503 }
      );
    }
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }
    return handler(req, ctx, session);
  };
}
