// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import AuthProvider from '@/components/AuthProvider' // ÚJ: AuthProvider importálása

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BullishFlag.xyz',
  description: 'Top Performing Crypto Coins by Timeframe',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-black dark:bg-black dark:text-white`}>
        {/* Az AuthProvider becsomagolja az egész alkalmazást a session kezeléshez */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}