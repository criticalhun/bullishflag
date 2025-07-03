import './globals.css'
import { Inter } from 'next/font/google'

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
    <html lang="en"> {/* NE add meg itt a "dark" class-t! */}
      <body className={`${inter.className} bg-white text-black dark:bg-black dark:text-white`}>
        {children}
      </body>
    </html>
  )
}
