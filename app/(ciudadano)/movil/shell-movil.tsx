'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { AlertTriangle, Bell, Home, MapPinned, Menu, UserRound } from 'lucide-react'

export function ShellMovil({ children }: { children: ReactNode }) {
  const enDesvia = usePathname().startsWith('/movil/desvia')

  return (
    <div className="mobile-shell">
      <header className="flex shrink-0 items-center justify-between bg-[#08A9D8] px-5 py-4 text-white">
        <button type="button" aria-label="Abrir menú"><Menu /></button>
        <strong className="text-xl">TR-Móvil</strong>
        <span className="w-6" aria-hidden="true" />
      </header>
      <main className="relative min-h-0 flex-1 overflow-y-auto bg-white">{children}</main>
      <nav aria-label="Navegación principal" className="grid shrink-0 grid-cols-5 border-t bg-white px-2 py-2 text-[10px] text-slate-500">
        <Link href="/movil" className="flex flex-col items-center gap-1"><Home size={18} />Inicio</Link>
        <span className="flex flex-col items-center gap-1"><MapPinned size={18} />Mapa</span>
        <Link href="/movil/desvia" aria-current={enDesvia ? 'page' : undefined} className="flex flex-col items-center gap-1 font-black text-[#F26B1D]">
          <AlertTriangle size={18} aria-hidden="true" />desvIA
        </Link>
        <span className="flex flex-col items-center gap-1"><Bell size={18} />Avisos</span>
        <span className="flex flex-col items-center gap-1"><UserRound size={18} />Perfil</span>
      </nav>
      <p className="shrink-0 bg-white px-4 py-2 text-center text-[10px] text-slate-400">Maqueta adaptable. No reproduce la interfaz real de TR-Móvil.</p>
    </div>
  )
}
