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
    // Meglévő GitHub bejelentkezés
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    // ÚJ: Email/Jelszó bejelentkezés
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // 1. Keressük a felhasználót az email címe alapján
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          return null;
        }

        // 2. Ellenőrizzük a jelszót a bcrypt segítségével
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        // Ha minden rendben, visszaadjuk a felhasználót
        return user;
      }
    })
  ],
  session: {
    strategy: "jwt", // A Credentials provider-hez JWT stratégia szükséges
  },
  callbacks: {
    // A JWT tokenbe beletesszük a felhasználó ID-ját
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // A session objektumba is beletesszük a felhasználó ID-ját a tokenből
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  // Megadjuk az egyedi bejelentkezési oldalunk útvonalát
  pages: {
    signIn: '/signin',
  },
};
