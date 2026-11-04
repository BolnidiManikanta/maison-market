import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CommerceProvider } from '@/components/commerce-provider'
export const metadata: Metadata = {
  title: 'TechieSmart — Shop together. Save together.',
  description:
    'A community-commerce marketplace for everyday shopping, transparent BOGO savings, nearby services, resale and refurbished products.',
  generator: 'TechieSmart',
}
export const viewport: Viewport={colorScheme:'light',themeColor:'#f6f5f0'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" className="bg-background"><body className="antialiased"><CommerceProvider>{children}</CommerceProvider></body></html>}
