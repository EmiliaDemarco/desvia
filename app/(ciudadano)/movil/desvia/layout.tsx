import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { ShellMovil } from '../shell-movil'
import 'leaflet/dist/leaflet.css'
import '../movil.css'

export const metadata: Metadata = { title: 'desvIA · TR-Móvil (maqueta)' }

export default function DesviaLayout({ children }: { children: ReactNode }) {
  return <ShellMovil>{children}</ShellMovil>
}
