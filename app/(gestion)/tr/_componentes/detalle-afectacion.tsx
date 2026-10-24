'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { ArrowLeft, Lock } from 'lucide-react'
import { AHORA_SIMULADO } from '@/lib/alerts/simulacion'
import { formatearFechaHora, NOMBRE_CORTE, NOMBRE_IMPACTO, NOMBRE_TIPO } from '@/lib/formato'
import { esVisibleParaCiudadano } from '@/lib/gestion/visibilidad'
import { useDemoStore } from '@/lib/store'
import type { Afectacion } from '@/lib/types'
import { useHidratado } from '@/lib/use-hidratado'
import { AccionesAfectacion } from './acciones-afectacion'
import { EtiquetaSimulado } from './etiqueta-simulado'
import { HistorialLista } from './historial-lista'
import { InsigniaEstado, InsigniaPublicacion } from './insignias'
import { AfectacionNoEncontrada, EsqueletoCarga } from './no-encontrada'

const AVISO_GUARDADO: Record<string, string> = {
  creada: 'Afectación creada. El alta quedó registrada en el historial.',
  editada: 'Cambios guardados. Quedaron registrados en el historial.',
}

function textoVisibilidad(afectacion: Afectacion): string {
  if (esVisibleParaCiudadano(afectacion, AHORA_SIMULADO)) return 'Visible para la ciudadanía.'
  if (afectacion.publicacion === 'programada') return `Todavía no visible: se publica sola el ${formatearFechaHora(afectacion.inicio)}.`
  return 'No visible para la ciudadanía: está en borrador.'
}

function Dato({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{etiqueta}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  )
}

export function DetalleAfectacion({ id }: { id: string }) {
  const hidratado = useHidratado()
  const afectaciones = useDemoStore((s) => s.afectaciones)
  const historial = useDemoStore((s) => s.historial)
  const guardado = useSearchParams().get('guardado')
  const [mensaje, setMensaje] = useState('')

  const afectacion = afectaciones.find((a) => a.id === id)
  const cambios = useMemo(
    () => historial.filter((c) => c.entidad === 'afectacion' && c.entidadId === id).sort((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha)),
    [historial, id],
  )

  if (!hidratado) return <EsqueletoCarga />
  if (!afectacion) return <AfectacionNoEncontrada />

  const aviso = mensaje || (guardado ? (AVISO_GUARDADO[guardado] ?? '') : '')

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 p-4 lg:p-8">
      <Link href="/tr/afectaciones" className="inline-flex min-h-10 w-fit items-center gap-1.5 text-sm font-medium text-primary underline-offset-2 hover:underline">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Volver a Afectaciones
      </Link>

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-balance text-2xl font-bold">{afectacion.titulo}</h1>
          <EtiquetaSimulado />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <InsigniaEstado estado={afectacion.estado} />
          <InsigniaPublicacion publicacion={afectacion.publicacion} />
          <span className="text-xs text-muted-foreground">Código {afectacion.id}</span>
        </div>
        <AccionesAfectacion afectacion={afectacion} onMensaje={setMensaje} />
      </header>

      <div role="status" aria-live="polite" className={aviso ? 'rounded-lg border border-primary bg-secondary p-3 text-sm font-medium' : 'sr-only'}>
        {aviso}
      </div>

      <section aria-labelledby="titulo-publico" className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
        <h2 id="titulo-publico" className="text-base font-bold">Datos públicos</h2>
        <p className="text-sm text-muted-foreground">{textoVisibilidad(afectacion)}</p>
        <p className="text-pretty text-sm leading-relaxed">{afectacion.descripcion || 'Sin descripción.'}</p>
        <dl className="grid gap-4 sm:grid-cols-2">
          <Dato etiqueta="Tipo">{NOMBRE_TIPO[afectacion.tipo]}</Dato>
          <Dato etiqueta="Impacto">{NOMBRE_IMPACTO[afectacion.impacto]}</Dato>
          <Dato etiqueta="Dirección">{afectacion.direccion}</Dato>
          <Dato etiqueta="Zona">{afectacion.zona}</Dato>
          <Dato etiqueta="Ubicación">
            {afectacion.latitud.toFixed(5)}, {afectacion.longitud.toFixed(5)}
          </Dato>
          <Dato etiqueta="Tipo de corte">{afectacion.tipoCorte ? NOMBRE_CORTE[afectacion.tipoCorte] : '—'}</Dato>
          <Dato etiqueta="Sentido afectado">{afectacion.sentidoAfectado || '—'}</Dato>
          <Dato etiqueta="Inicio">{formatearFechaHora(afectacion.inicio)}</Dato>
          <Dato etiqueta="Fin estimado">{afectacion.fin ? formatearFechaHora(afectacion.fin) : '—'}</Dato>
          <Dato etiqueta="Fuente">{afectacion.fuente}</Dato>
          <Dato etiqueta="Última actualización">{formatearFechaHora(afectacion.actualizadaEn)}</Dato>
        </dl>
      </section>

      <section aria-labelledby="titulo-interno" className="flex flex-col gap-2 rounded-lg border border-dashed border-muted-foreground bg-secondary p-4">
        <h2 id="titulo-interno" className="flex flex-wrap items-center gap-2 text-base font-bold">
          <Lock className="size-4" aria-hidden="true" />
          Observaciones internas
          <span className="text-xs font-semibold text-muted-foreground">No visible para ciudadanos</span>
        </h2>
        <p className="text-pretty text-sm leading-relaxed">{afectacion.observacionesInternas || 'Sin observaciones internas.'}</p>
      </section>

      <section aria-labelledby="titulo-historial" className="flex flex-col gap-3">
        <h2 id="titulo-historial" className="text-base font-bold">Historial de cambios</h2>
        <HistorialLista cambios={cambios} vacio="Esta afectación todavía no tiene cambios registrados." />
      </section>
    </div>
  )
}
