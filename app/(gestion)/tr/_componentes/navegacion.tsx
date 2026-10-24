'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FlaskConical, History, LayoutDashboard, ListChecks, LogOut, Route, Sparkles, TriangleAlert, type LucideIcon } from 'lucide-react'
import { useDemoStore } from '@/lib/store'
import type { UsuarioDemo } from '@/lib/types'

const SECCIONES: Array<{ href: string; etiqueta: string; Icono: LucideIcon }> = [
  { href: '/tr', etiqueta: 'Dashboard', Icono: LayoutDashboard },
  { href: '/tr/afectaciones', etiqueta: 'Afectaciones', Icono: TriangleAlert },
  { href: '/tr/sugerencias', etiqueta: 'Sugerencias IA', Icono: Sparkles },
  { href: '/tr/laboratorio', etiqueta: 'Laboratorio de análisis', Icono: FlaskConical },
  { href: '/tr/historial', etiqueta: 'Historial', Icono: History },
  { href: '/evolucion', etiqueta: 'Evolución con IA', Icono: Route },
  { href: '/demo', etiqueta: 'Guía de la demo', Icono: ListChecks },
]

interface MenuTrProps {
  usuario: UsuarioDemo
  onNavegar?: () => void
}

export function MenuTr({ usuario, onNavegar }: MenuTrProps) {
  const pathname = usePathname()
  const setUsuarioActual = useDemoStore((s) => s.setUsuarioActual)

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 p-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-lg font-bold leading-tight">desvIA TR</span>
        <span className="text-xs text-sidebar-foreground/80">Gestión de afectaciones</span>
      </div>

      <nav aria-label="Secciones del panel" className="flex flex-1 flex-col gap-1">
        {SECCIONES.map(({ href, etiqueta, Icono }) => {
          const activa = href === '/tr' ? pathname === '/tr' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavegar}
              aria-current={activa ? 'page' : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring ${
                activa ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/60'
              }`}
            >
              <Icono className="size-5 shrink-0" aria-hidden="true" />
              {etiqueta}
            </Link>
          )
        })}
      </nav>

      <div className="flex flex-col gap-3 border-t border-sidebar-border pt-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold">{usuario.nombre}</span>
          <span className="text-xs text-sidebar-foreground/80">{usuario.rol} · cuenta simulada</span>
        </div>
        <button
          type="button"
          onClick={() => setUsuarioActual(null)}
          className="flex min-h-11 items-center gap-2 rounded-lg border border-sidebar-border px-3 text-sm font-medium outline-none hover:bg-sidebar-accent/60 focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Cerrar sesión demo
        </button>
      </div>
    </div>
  )
}
