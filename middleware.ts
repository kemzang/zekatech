import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const path = req.nextUrl.pathname;

  // Contact: require auth
  if (path.startsWith("/contact")) {
    if (!token) {
      const login = new URL("/login", req.url);
      login.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  // Admin dashboard: require auth + ADMIN role
  if (path.startsWith("/dashboard")) {
    if (!token) {
      const login = new URL("/login", req.url);
      login.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(login);
    }
    if ((token as { role?: string }).role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/contact", "/contact/:path*", "/dashboard", "/dashboard/:path*"],
};
