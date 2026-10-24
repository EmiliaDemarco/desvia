'use client'

import { useEffect, useMemo, useState } from 'react'
import { AHORA_SIMULADO } from '@/lib/alerts/simulacion'
import { afectacionesParaCiudadano } from '@/lib/gestion/visibilidad'
import { useDemoStore } from '@/lib/store'
import { useHidratado } from '@/lib/use-hidratado'

const CLAVE_STORE = 'desvia-demo-store'

const formatoHora = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

export function EstadoSincronizacion() {
  const hidratado = useHidratado()
  const afectaciones = useDemoStore((estado) => estado.afectaciones)
  const [ultimaSincronizacion, setUltimaSincronizacion] = useState<Date | null>(null)

  useEffect(() => {
    // El evento storage llega a esta ventana cuando el panel o el celular (otros documentos) escriben el store.
    const alCambiar = (evento: StorageEvent) => {
      if (evento.key === CLAVE_STORE) setUltimaSincronizacion(new Date())
    }
    window.addEventListener('storage', alCambiar)
    return () => window.removeEventListener('storage', alCambiar)
  }, [])

  const { visibles, sinPublicar } = useMemo(() => {
    const visibles = afectacionesParaCiudadano(afectaciones, AHORA_SIMULADO).length
    return { visibles, sinPublicar: afectaciones.length - visibles }
  }, [afectaciones])

  return (
    <section aria-label="Estado de la sincronización" className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-1 border-b border-[#d5dce8] bg-[#ffffff] px-4 py-2 text-xs sm:text-sm">
      <p className="flex items-center gap-2 font-semibold">
        <span aria-hidden="true" className="size-2 rounded-full bg-[#F26B1D]" />
        Mismo store, sincronizado por <code className="rounded bg-[#f3f5f9] px-1 py-0.5 font-mono text-[0.8em]">storage</code>
      </p>
      <p role="status" aria-live="polite" className="flex flex-wrap gap-x-5 gap-y-0.5 text-[#4b5870]">
        <span>
          Visibles para el ciudadano: <strong className="text-[#0f1b33]">{hidratado ? visibles : '–'}</strong>
        </span>
        <span>
          Sin publicar: <strong className="text-[#0f1b33]">{hidratado ? sinPublicar : '–'}</strong>
        </span>
        <span>
          Último cambio recibido: <strong className="text-[#0f1b33]">{ultimaSincronizacion ? formatoHora.format(ultimaSincronizacion) : 'todavía ninguno'}</strong>
        </span>
      </p>
    </section>
  )
}
