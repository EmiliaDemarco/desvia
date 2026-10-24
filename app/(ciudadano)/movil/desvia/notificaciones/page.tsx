'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { CheckCheck } from 'lucide-react'
import { ETIQUETA_TIPO, formatearFechaHora, TIPOS_AFECTACION } from '@/lib/formato'
import { marcarNotificacionLeida, marcarTodasLeidas } from '@/lib/services/notificaciones'
import { useDemoStore } from '@/lib/store'
import type { Notificacion, TipoAfectacion } from '@/lib/types'
import { useHidratado } from '@/lib/use-hidratado'
import { SubEncabezado } from '../sub-encabezado'

export default function NotificacionesPage() {
  const router = useRouter()
  const hidratado = useHidratado()
  const notificaciones = useDemoStore((estado) => estado.notificaciones)
  const [categoria, setCategoria] = useState<TipoAfectacion | 'todas'>('todas')

  const ordenadas = useMemo(() => [...notificaciones].sort((a, b) => Date.parse(b.creadaEn) - Date.parse(a.creadaEn)), [notificaciones])
  const visibles = ordenadas.filter((n) => categoria === 'todas' || n.tipo === categoria)
  const sinLeer = notificaciones.filter((n) => !n.leida).length
  const categorias = TIPOS_AFECTACION.filter((t) => notificaciones.some((n) => n.tipo === t))

  const abrir = (notificacion: Notificacion) => {
    void marcarNotificacionLeida(notificacion.id)
    router.push(notificacion.afectacionId ? `/movil/desvia?afectacion=${notificacion.afectacionId}` : '/movil/desvia')
  }

  return (
    <>
      <SubEncabezado titulo="Notificaciones" />
      {!hidratado ? (
        <p className="px-5 py-8 text-sm text-slate-500">Cargando notificaciones…</p>
      ) : (
        <>
          <div className="space-y-3 border-b px-4 py-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(['todas', ...categorias] as Array<TipoAfectacion | 'todas'>).map((item) => (
                <button key={item} onClick={() => setCategoria(item)} aria-pressed={categoria === item} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${categoria === item ? 'border-[#1551A1] bg-[#1551A1] text-white' : 'border-slate-200 text-slate-600'}`}>
                  {item === 'todas' ? 'Todas' : ETIQUETA_TIPO[item]}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-600">{sinLeer === 0 ? 'No tenés avisos sin leer' : `${sinLeer} sin leer`}</p>
              <button onClick={() => void marcarTodasLeidas()} disabled={sinLeer === 0} className="flex items-center gap-1.5 rounded-full border border-[#1551A1] px-3 py-2 text-xs font-bold text-[#1551A1] disabled:border-slate-200 disabled:text-slate-400">
                <CheckCheck size={15} /> Marcar todas como leídas
              </button>
            </div>
          </div>
          {visibles.length === 0 ? (
            <p className="px-5 py-8 text-sm text-slate-500">No hay notificaciones en esta categoría.</p>
          ) : (
            <ul>
              {visibles.map((n) => (
                <li key={n.id} className="border-b">
                  <button onClick={() => abrir(n)} className={`flex w-full items-start gap-3 px-5 py-4 text-left ${n.leida ? 'bg-white' : 'bg-blue-50/60'}`}>
                    <span className="mt-1.5 flex size-2.5 shrink-0">
                      {!n.leida && (
                        <>
                          <span className="size-2.5 rounded-full bg-[#1551A1]" aria-hidden="true" />
                          <span className="sr-only">Sin leer</span>
                        </>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2 text-xs text-slate-500">
                        <span className="font-bold uppercase tracking-wide text-[#1551A1]">{ETIQUETA_TIPO[n.tipo]}</span>
                        <span>Recibida {formatearFechaHora(n.creadaEn)}</span>
                      </span>
                      <strong className={`mt-1 block text-sm text-slate-900 ${n.leida ? 'font-semibold' : 'font-black'}`}>{n.titulo}</strong>
                      <span className="mt-0.5 block text-sm leading-snug text-slate-600">{n.mensaje}</span>
                      <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-amber-700">DATO SIMULADO · Tocá para verla en el mapa</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  )
}
