import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import { getBaseUrl } from '@/lib/utils'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: 'AI Hub — Find the Perfect AI Tool for Any Task',
    template: '%s | AI Hub',
  },
  description:
    'Discover and compare the best AI tools and neural networks. Find the perfect AI for text generation, image creation, coding, translation, and more.',
  keywords: ['AI tools', 'neural networks', 'artificial intelligence', 'AI directory', 'ChatGPT', 'Midjourney'],
  authors: [{ name: 'AI Hub' }],
  creator: 'AI Hub',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: getBaseUrl(),
    siteName: 'AI Hub',
    title: 'AI Hub — Find the Perfect AI Tool for Any Task',
    description: 'Discover and compare 35+ AI tools.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Hub — Find the Perfect AI Tool for Any Task',
    description: 'Discover and compare 35+ AI tools.',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
