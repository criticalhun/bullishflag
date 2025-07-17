// src/app/api/db-test/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log("Attempting to connect to the database...");
    const userCount = await prisma.user.count();
    console.log("Successfully connected and queried the database.");

    return NextResponse.json({ 
      status: 'success', 
      message: 'Database connection is working.',
      userCount: userCount 
    });

  } catch (error) {
    console.error("Database connection failed:", error);

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to connect to the database.',
      error: errorMessage
    }, { status: 500 });
  }
}
