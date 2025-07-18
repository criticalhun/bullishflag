// src/app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // 1. Alapvető validáció
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Ellenőrizzük, hogy létezik-e már a felhasználó
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 }); // 409 Conflict
    }

    // 3. Jelszó hashelése
    const hashedPassword = await bcrypt.hash(password, 10); // A 10 a "sózás" erőssége

    // 4. Új felhasználó létrehozása az adatbázisban
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Sikeres regisztráció esetén visszaadjuk a létrehozott felhasználót (jelszó nélkül)
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    }, { status: 201 }); // 201 Created

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
