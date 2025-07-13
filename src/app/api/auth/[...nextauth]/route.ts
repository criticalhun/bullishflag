// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Az új, központi helyről importálunk

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };