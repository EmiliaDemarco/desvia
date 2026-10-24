'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Bell, Car, ChevronDown, Menu, X } from 'lucide-react'
import { useDemoStore } from '@/lib/store'
import { useHidratado } from '@/lib/use-hidratado'

const ITEMS_TR_MOVIL = ['Principal', 'Estacionar', 'Estado zona informada']
const ITEMS_INFORMACION = ['Tarifas y horarios', 'Zonas de estacionamiento', 'Ayuda y contacto']
const ITEMS_DESVIA = [
  { href: '/movil/desvia', texto: 'Mapa de afectaciones' },
  { href: '/movil/desvia/notificaciones', texto: 'Notificaciones' },
  { href: '/movil/desvia/preferencias', texto: 'Preferencias de avisos' },
]

const claseItem = 'flex min-h-12 w-full items-center justify-between px-6 text-left text-lg font-semibold text-slate-800 active:bg-slate-100'

export function ShellMovil({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const hidratado = useHidratado()
  const sinLeer = useDemoStore((estado) => estado.notificaciones.filter((n) => !n.leida).length)
  const [abierto, setAbierto] = useState(false)
  const [desviaAbierta, setDesviaAbierta] = useState(true)
  const [informacionAbierta, setInformacionAbierta] = useState(false)
  const [aviso, setAviso] = useState('')
  const botonCerrar = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setAbierto(false)
  }, [pathname])

  useEffect(() => {
    if (!abierto) return
    setAviso('')
    botonCerrar.current?.focus()
    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') setAbierto(false)
    }
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [abierto])

  const cantidad = hidratado ? sinLeer : 0
  const avisarFueraDeMaqueta = (nombre: string) => setAviso(`"${nombre}" es un módulo de TR-Móvil que no está incluido en esta maqueta.`)

  return (
    <div className="mobile-shell">
      <header className="grid shrink-0 grid-cols-[2.75rem_1fr_2.75rem] items-center bg-[#08A9D8] px-2 py-2 text-white">
        <button type="button" onClick={() => setAbierto(true)} aria-label="Abrir menú" aria-expanded={abierto} aria-controls="menu-lateral" className="grid size-11 place-items-center rounded-full">
          <Menu />
        </button>
        <strong className="text-center text-xl">TR-Móvil</strong>
        <Link
          href="/movil/desvia/notificaciones"
          aria-label={cantidad > 0 ? `Notificaciones, ${cantidad} sin leer` : 'Notificaciones'}
          className="relative grid size-11 place-items-center rounded-full"
        >
          <Bell />
          {cantidad > 0 && (
            <span className="absolute right-0.5 top-0.5 grid min-w-5 place-items-center rounded-full bg-[#F26B1D] px-1 text-[11px] font-black leading-5 text-white">{cantidad}</span>
          )}
        </Link>
      </header>
      <main className="relative min-h-0 flex-1 overflow-y-auto bg-white">{children}</main>
      <p className="shrink-0 bg-white px-4 py-2 text-center text-[10px] text-slate-500">Maqueta adaptable. No reproduce la interfaz real de TR-Móvil.</p>

      {abierto && (
        <div className="absolute inset-0 z-[2000]">
          <button type="button" aria-label="Cerrar menú" tabIndex={-1} onClick={() => setAbierto(false)} className="absolute inset-0 bg-black/50" />
          <nav id="menu-lateral" aria-label="Menú de TR-Móvil" className="drawer-panel absolute inset-y-0 left-0 flex w-[78%] max-w-[320px] flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-start justify-between px-4 pt-4">
              <span className="w-11" aria-hidden="true" />
              <span className="grid size-16 place-items-center rounded-full bg-[#1551A1] text-white" aria-hidden="true">
                <Car size={34} />
              </span>
              <button ref={botonCerrar} type="button" onClick={() => setAbierto(false)} aria-label="Cerrar menú" className="grid size-11 place-items-center rounded-full text-slate-600">
                <X />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-wider text-amber-700">Maqueta · datos simulados</p>

            <ul className="mt-4">
              {ITEMS_TR_MOVIL.map((nombre) => (
                <li key={nombre}>
                  <button type="button" onClick={() => avisarFueraDeMaqueta(nombre)} className={claseItem}>{nombre}</button>
                </li>
              ))}
              <li>
                <button type="button" onClick={() => setDesviaAbierta((valor) => !valor)} aria-expanded={desviaAbierta} aria-controls="submenu-desvia" className={claseItem}>
                  <span>desv<span className="text-[#F26B1D]">IA</span></span>
                  <ChevronDown size={20} className={`transition-transform ${desviaAbierta ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
                {desviaAbierta && (
                  <ul id="submenu-desvia" className="bg-slate-50 py-1">
                    {ITEMS_DESVIA.map((item) => {
                      const activo = pathname === item.href
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-current={activo ? 'page' : undefined}
                            className={`flex min-h-12 items-center justify-between pl-10 pr-6 text-base ${activo ? 'font-black text-[#1551A1]' : 'font-medium text-slate-700'}`}
                          >
                            {item.texto}
                            {item.href.endsWith('notificaciones') && cantidad > 0 && (
                              <span className="grid min-w-5 place-items-center rounded-full bg-[#F26B1D] px-1 text-[11px] font-black leading-5 text-white">{cantidad}</span>
                            )}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            </ul>

            <ul className="mt-2 border-t">
              <li>
                <button type="button" onClick={() => setInformacionAbierta((valor) => !valor)} aria-expanded={informacionAbierta} aria-controls="submenu-informacion" className={claseItem}>
                  Información
                  <ChevronDown size={20} className={`transition-transform ${informacionAbierta ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
                {informacionAbierta && (
                  <ul id="submenu-informacion" className="bg-slate-50 py-1">
                    {ITEMS_INFORMACION.map((nombre) => (
                      <li key={nombre}>
                        <button type="button" onClick={() => avisarFueraDeMaqueta(nombre)} className="flex min-h-12 w-full items-center pl-10 pr-6 text-left text-base font-medium text-slate-700">{nombre}</button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <Link href="/" className={claseItem}>Salir</Link>
              </li>
            </ul>

            {aviso && (
              <p role="status" className="mx-4 my-4 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">{aviso}</p>
            )}
          </nav>
        </div>
      )}
    </div>
  )
}
