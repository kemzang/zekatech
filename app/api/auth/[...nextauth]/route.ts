import NextAuth from "next-auth";
import { authOptions } from "@/auth";

const handler = NextAuth(authOptions);

async function handleWithJsonError(
  req: Request,
  context?: { params?: Promise<{ nextauth?: string[] }> }
) {
  try {
    return await (context ? handler(req, context as never) : handler(req));
  } catch (err) {
    console.error("[nextauth]", err);
    return new Response(
      JSON.stringify({ error: "Configuration error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export const GET = handleWithJsonError;
export const POST = handleWithJsonError;
