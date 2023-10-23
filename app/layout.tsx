import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['500', '600', '700', '900'] })

export const metadata: Metadata = {
	title: 'Nuba Nvoicex - API',
	description: 'Payments API',
}

export default function RootLayout({
  	children,
}: {
	children: React.ReactNode
}) {
    return (
        <html lang="en">
          <body className={poppins.className}>{children}</body>
        </html>
    )
}
