// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

// IDEIGLENESEN KIKAPCSOLTUK A PRISMÁT A HIBAKERESÉSHEZ
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma), // IDEIGLENESEN KIKAPCSOLVA
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    // A CredentialsProvider-t is ideiglenesen kivettük
  ],
  // A session és callbacks részeket is ideiglenesen kivettük
  // session: { strategy: "jwt" },
  // callbacks: { ... },
  
  // A pages részt is ideiglenesen kivesszük, hogy a NextAuth alapértelmezett oldalát használja
  // pages: { signIn: '/signin' },
};