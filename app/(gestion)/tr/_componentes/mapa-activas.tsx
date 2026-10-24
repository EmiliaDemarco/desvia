'use client'

import dynamic from 'next/dynamic'
import { useCallback, useMemo, useState } from 'react'
import type { Afectacion, Impacto } from '@/lib/types'

const Mapa = dynamic(() => import('@/app/(ciudadano)/movil/desvia/mapa'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-muted" role="status" aria-label="Cargando mapa" />,
})

const COLOR_IMPACTO: Record<Impacto, string> = { alto: '#dc2626', medio: '#eab308', bajo: '#2563eb' }

export function MapaActivas({ afectaciones }: { afectaciones: Afectacion[] }) {
  const activas = useMemo(() => afectaciones.filter((a) => a.estado === 'activa' && a.publicacion !== 'borrador'), [afectaciones])
  const [seleccionadaId, setSeleccionadaId] = useState<string | null>(null)
  const seleccionada = activas.find((a) => a.id === seleccionadaId)
  const seleccionar = useCallback((a: Afectacion) => setSeleccionadaId(a.id), [])

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="relative isolate z-0 h-[440px] min-w-0 overflow-hidden rounded-lg border border-border lg:flex-1">
        <Mapa
          afectaciones={activas}
          seleccionada={seleccionada}
          onSeleccionar={seleccionar}
          ubicacion={null}
          juan={null}
          radioM={1000}
          reinicioId={0}
          zonas={[]}
        />
      </div>

      <ul className="flex flex-col gap-2 lg:w-80 lg:shrink-0" aria-label="Afectaciones activas">
        {activas.length === 0 && <li className="text-sm text-muted-foreground">No hay afectaciones activas.</li>}
        {activas.map((a) => {
          const elegida = a.id === seleccionadaId
          return (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => setSeleccionadaId(a.id)}
                aria-pressed={elegida}
                className={`flex min-h-11 w-full flex-col gap-1 rounded-lg border p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  elegida ? 'border-primary bg-secondary' : 'border-border bg-card hover:bg-secondary'
                }`}
              >
                <span className="text-sm font-semibold">{a.titulo}</span>
                <span className="text-xs text-muted-foreground">{a.direccion}</span>
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: COLOR_IMPACTO[a.impacto] }} aria-hidden="true" />
                  Impacto {a.impacto}
                </span>
                {elegida && <span className="text-xs leading-relaxed text-muted-foreground">{a.descripcion} Fuente: {a.fuente}.</span>}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
