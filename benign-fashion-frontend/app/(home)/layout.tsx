import '.././globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { ReactQueryProvider } from '@/provider/react-query-provider'
import Footer from '@/components/shared/footer'
import LayoutClientWrapper from './layout-client-wrapper'

const inter = Inter({ subsets: ['latin'] })
  
export const metadata: Metadata = {
  title: 'Benign Fashion',
  description: 'Premium fashion with modern design and quality fabrics.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <LayoutClientWrapper>
            <main className="px-3">{children}</main>
            <Toaster />
            <Footer />
          </LayoutClientWrapper>
        </ReactQueryProvider>
      </body>
    </html>
  )
}