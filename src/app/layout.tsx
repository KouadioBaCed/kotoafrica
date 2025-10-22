import type { Metadata } from 'next'
import { Montserrat, Poppins, Open_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-montserrat',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-poppins',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-open-sans',
})

export const metadata: Metadata = {
  title: 'KÔTO AFRICA - L\'Afrique connectée au monde',
  description: 'Plateforme d\'intermédiation e-commerce connectant l\'Afrique au monde',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${montserrat.variable} ${poppins.variable} ${openSans.variable} font-openSans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
