// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prisma =
  global.prisma ||
  new PrismaClient({
    // Opcionális: a logolás segít a hibakeresésben a Vercel logokban
    log: ['warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma