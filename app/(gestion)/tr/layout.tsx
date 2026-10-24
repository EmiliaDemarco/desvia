import type { Metadata } from 'next'
import 'leaflet/dist/leaflet.css'
import '../../(ciudadano)/movil/movil.css'
import './tr.css'
import { TrShell } from './_componentes/tr-shell'

export const metadata: Metadata = {
  title: 'desvIA TR · Gestión de afectaciones (demostración)',
  description: 'Interfaz propuesta para demostración. No es un sistema municipal existente.',
}

export default function TrLayout({ children }: { children: React.ReactNode }) {
  return <TrShell>{children}</TrShell>
}
