import '.././globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { ReactQueryProvider } from '@/provider/react-query-provider'
import Footer from '@/components/shared/footer'
import LayoutClientWrapper from './layout-client-wrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'cloth store',
  description: 'Created with Next.js, TypeScript, Tailwind CSS, and shadcn/ui',
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
            <main className="p-6">{children}</main>
            <Toaster />
            <Footer />
          </LayoutClientWrapper>
        </ReactQueryProvider>
      </body>
    </html>
  )
}