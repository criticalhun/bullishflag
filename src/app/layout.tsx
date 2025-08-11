// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import AuthProvider from '@/components/AuthProvider'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BullishFlag.xyz',
  description: 'Top Performing Crypto Coins by Timeframe',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* JAVÍTÁS ITT: A háttérszín módosítása egy sötétebb szürkére */}
      <body className={`${inter.className} bg-slate-100 text-black dark:bg-gray-900 dark:text-white flex flex-col min-h-screen`}>
        <AuthProvider>
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
          <CookieBanner />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
