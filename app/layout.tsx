import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'desvIA · La ciudad te avisa antes.',
  description:
    'Prototipo de información urbana para Rosario: obras y cortes en el mapa, avisos anticipados según tu recorrido y un panel municipal de gestión. Datos simulados.',
  applicationName: 'desvIA',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0B1F3A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
