import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { rateLimit } from "@/lib/rate-limit";

type AppRole = "USER" | "ADMIN";

// Hash jetable utilise pour egaliser le temps de reponse d'un login rate.
const DUMMY_HASH = "$2a$12$K9Xh8zj6oQWzv5g7mJpQ6uJ1nYxUQ0r0vJ3qC1yKl8sB5mFzN2W9C";

declare module "next-auth" {
  interface User {
    id: string;
    role: AppRole;
    remember?: boolean;
  }
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      role: AppRole;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: AppRole;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
        remember: { label: "Se souvenir de moi", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = String(credentials.email).trim();
        // Anti-force brute : 10 tentatives par compte et par quart d'heure.
        if (!rateLimit(`login:${email.toLowerCase()}`, 10, 15 * 60_000).ok) {
          throw new Error("Trop de tentatives. Réessayez dans quelques minutes.");
        }
        try {
          // Les comptes crees avant la normalisation peuvent contenir des
          // majuscules : on retente donc sans tenir compte de la casse.
          const user =
            (await prisma.user.findUnique({ where: { email } })) ??
            (await prisma.user.findFirst({
              where: { email: { equals: email, mode: "insensitive" } },
            }));
          if (!user) {
            // Cout constant : evite de distinguer "email inconnu" de
            // "mot de passe faux" par le temps de reponse.
            await bcrypt.compare(String(credentials.password), DUMMY_HASH);
            return null;
          }
          const ok = await bcrypt.compare(
            String(credentials.password),
            user.passwordHash
          );
          if (!ok) return null;
          const remember = credentials.remember === "true";
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as AppRole,
            remember,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        // Se souvenir de moi : 30 jours, sinon 1 jour (session courte)
        const maxAge = user.remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
        token.exp = Math.floor(Date.now() / 1000) + maxAge;
      }
      // Mettre à jour le token quand la session est mise à jour
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name as string | null;
        session.user.email = token.email as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
