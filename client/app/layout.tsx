import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AppAuthProvider from '@/components/AppAuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const viewport = {
  themeColor: '#7226FF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'CertiFind | Course Aggregator',
  description: 'Find the best paid and free courses from Coursera, Udemy, and more.',
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'CertiFind',
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-neutral-950 text-neutral-50 min-h-screen flex flex-col`}>
        <AppAuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AppAuthProvider>
      </body>
    </html>
  )
}

