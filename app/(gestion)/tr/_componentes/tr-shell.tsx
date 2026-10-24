'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useHidratado } from '@/lib/use-hidratado'
import { useDemoStore } from '@/lib/store'
import type { UsuarioDemo } from '@/lib/types'
import { LoginDemo } from './login-demo'
import { MenuTr } from './navegacion'

function BannerTr() {
  return (
    <p role="note" className="shrink-0 bg-[var(--aviso)] px-4 py-2 text-center text-xs font-semibold leading-snug text-foreground sm:text-sm">
      desvIA TR — Gestión de afectaciones. Interfaz propuesta para demostración. No es un sistema municipal existente.
    </p>
  )
}

function PanelTr({ usuario, children }: { usuario: UsuarioDemo; children: React.ReactNode }) {
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    if (!menuAbierto) return
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuAbierto(false)
    }
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [menuAbierto])

  return (
    <div className="relative flex min-h-0 flex-1">
      <aside className="hidden w-64 shrink-0 flex-col overflow-y-auto bg-sidebar text-sidebar-foreground lg:flex">
        <MenuTr usuario={usuario} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center gap-2 border-b border-border bg-card px-2 py-1.5 lg:hidden">
          <button
            type="button"
            onClick={() => setMenuAbierto(true)}
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            aria-controls="menu-tr"
            className="flex size-11 items-center justify-center rounded-lg outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
          <span className="font-bold">desvIA TR</span>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>

      {menuAbierto && (
        <div className="absolute inset-0 z-50 flex lg:hidden">
          <div id="menu-tr" role="dialog" aria-modal="true" aria-label="Menú de gestión" className="flex w-72 max-w-[85%] flex-col overflow-y-auto bg-sidebar text-sidebar-foreground">
            <div className="flex justify-end px-2 pt-2">
              <button
                type="button"
                onClick={() => setMenuAbierto(false)}
                aria-label="Cerrar menú"
                className="flex size-11 items-center justify-center rounded-lg outline-none hover:bg-sidebar-accent/60 focus-visible:ring-2 focus-visible:ring-sidebar-ring"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <MenuTr usuario={usuario} onNavegar={() => setMenuAbierto(false)} />
          </div>
          <button type="button" aria-label="Cerrar menú" tabIndex={-1} onClick={() => setMenuAbierto(false)} className="flex-1 bg-foreground/40" />
        </div>
      )}
    </div>
  )
}

export function TrShell({ children }: { children: React.ReactNode }) {
  const hidratado = useHidratado()
  const usuario = useDemoStore((s) => s.usuarioActual)

  return (
    <div className="tr-root flex h-dvh flex-col bg-background text-foreground">
      <BannerTr />
      {!hidratado ? <div className="flex-1" aria-busy="true" /> : usuario ? <PanelTr usuario={usuario}>{children}</PanelTr> : <LoginDemo />}
    </div>
  )
}
