// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("[Authorize] Starting credentials check for:", credentials?.email);

        if (!credentials?.email || !credentials.password) {
          console.log("[Authorize] Missing email or password.");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          console.log("[Authorize] User not found in database.");
          return null;
        }

        if (!user.password) {
          console.log("[Authorize] User found, but has no password set (likely a GitHub user).");
          return null;
        }

        try {
          console.log("[Authorize] Comparing passwords...");
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            console.log("[Authorize] Password comparison failed.");
            return null;
          }

          console.log("[Authorize] Password is valid. Authorizing user.");
          return user;

        } catch (error) {
          console.error("[Authorize] Error during bcrypt.compare:", error);
          return null; // Hiba esetén soha ne engedjük be a felhasználót
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
};