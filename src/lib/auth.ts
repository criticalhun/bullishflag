// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    // --- ÚJ, DIAGNOSZTIKAI RÉSZ ---
    async redirect({ url, baseUrl }) {
      // Kiírjuk a szerveroldali logba, hogy mit lát a NextAuth
      console.log("[next-auth][debug] REDIRECT CALLBACK TRIGGERED");
      console.log(`[next-auth][debug] URL from provider: ${url}`);
      console.log(`[next-auth][debug] Base URL of site: ${baseUrl}`);

      // Ez a NextAuth alapértelmezett viselkedése, ezt nem változtatjuk
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
};