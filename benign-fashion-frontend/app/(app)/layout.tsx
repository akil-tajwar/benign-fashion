import '.././globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { ReactQueryProvider } from '@/provider/react-query-provider'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar/dashboard-sidebar'

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
          <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset>
              <main className="p-6">{children}</main>
              <Toaster />
            </SidebarInset>
          </SidebarProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
