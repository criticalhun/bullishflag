// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials"; // ÚJ IMPORT
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt"; // ÚJ IMPORT

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // 1. GitHub bejelentkezés (ez megmarad)
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    // 2. ÚJ: Email/Jelszó bejelentkezés
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

        // Keressük a felhasználót az email címe alapján az adatbázisban
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          // Ha a felhasználó nem létezik, vagy a jelszava nincs beállítva (pl. GitHub-bal regisztrált)
          return null;
        }

        // Ellenőrizzük a jelszót a bcrypt segítségével
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
  // Megadjuk az egyedi bejelentkezési oldalunk útvonalát (ezt később hozzuk létre)
  pages: {
    signIn: '/signin',
  },
};