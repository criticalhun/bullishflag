// src/app/api/debug-env/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Kiolvassuk a legfontosabb környezeti változókat, ahogy a Vercel szervere látja őket.
  const debugInfo = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NINCS BEÁLLÍTVA (NOT SET)",
    GITHUB_ID: process.env.GITHUB_ID ? "Be van állítva (Set)" : "NINCS BEÁLLÍTVA (NOT SET)",
    // A secret-et biztonsági okokból soha nem írjuk ki, csak azt, hogy létezik-e.
    GITHUB_SECRET_EXISTS: process.env.GITHUB_SECRET ? "Igen (Yes)" : "Nem (No)",
    NODE_ENV: process.env.NODE_ENV || "N/A",
  };

  return NextResponse.json(debugInfo);
}
