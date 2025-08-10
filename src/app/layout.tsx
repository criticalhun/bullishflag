// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import AuthProvider from '@/components/AuthProvider'
import Footer from '@/components/Footer' // ÚJ
import CookieBanner from '@/components/CookieBanner' // ÚJ

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BullishFlag.xyz',
  description: 'Top Performing Crypto Coins by Timeframe',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-black dark:bg-black dark:text-white flex flex-col min-h-screen`}>
        <AuthProvider>
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  )
}