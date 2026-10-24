'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Bot, Check, X } from 'lucide-react'
import { formatearFechaHora } from '@/lib/formato'
import { aceptarSugerencia, aprobarYPublicarSugerencia, descartarSugerencia, type ResultadoSugerencia } from '@/lib/services/sugerencias'
import { useDemoStore } from '@/lib/store'
import type { SugerenciaIA } from '@/lib/types'
import { useHidratado } from '@/lib/use-hidratado'
import { EtiquetaSimulado } from './etiqueta-simulado'
import { CLASE_BOTON, CLASE_BOTON_PRIMARIO } from './laboratorio/estilos'

const NOMBRE_ESTADO_SUGERENCIA: Record<SugerenciaIA['estado'], string> = {
  pendiente: 'Pendiente de revisión',
  aceptada: 'Aprobada',
  descartada: 'Descartada',
}

function TarjetaSugerencia({ sugerencia, onResultado }: { sugerencia: SugerenciaIA; onResultado: (resultado: ResultadoSugerencia) => void }) {
  const [procesando, setProcesando] = useState(false)
  const pendiente = sugerencia.estado === 'pendiente'
  const deCamara = sugerencia.latitud !== undefined

  async function ejecutar(accion: () => Promise<ResultadoSugerencia> | ResultadoSugerencia) {
    setProcesando(true)
    onResultado(await accion())
    setProcesando(false)
  }

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
          <Bot className="size-4" aria-hidden="true" />
          Sugerencia de IA
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            pendiente ? 'bg-secondary text-secondary-foreground ring-1 ring-border' : 'bg-muted text-muted-foreground'
          }`}
        >
          {NOMBRE_ESTADO_SUGERENCIA[sugerencia.estado]}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold">{sugerencia.titulo ?? 'Comunicación preventiva'}</h3>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{sugerencia.texto}</p>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4">
        {deCamara && (
          <>
            <div>
              <dt className="text-muted-foreground">Ubicación</dt>
              <dd className="font-semibold">{sugerencia.direccion}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Confianza estimada</dt>
              <dd className="font-semibold tabular-nums">{Math.round((sugerencia.confianza ?? 0) * 100)} %</dd>
            </div>
          </>
        )}
        <div>
          <dt className="text-muted-foreground">Generada</dt>
          <dd className="font-semibold tabular-nums">{formatearFechaHora(sugerencia.creadaEn)}</dd>
        </div>
        {sugerencia.origen && (
          <div>
            <dt className="text-muted-foreground">Origen</dt>
            <dd className="font-semibold">{sugerencia.origen}</dd>
          </div>
        )}
      </dl>

      {pendiente && (
        <div className="flex flex-wrap gap-2">
          {deCamara ? (
            <button type="button" disabled={procesando} onClick={() => ejecutar(() => aprobarYPublicarSugerencia(sugerencia.id))} className={CLASE_BOTON_PRIMARIO}>
              <Check className="size-3.5" aria-hidden="true" />
              Aprobar y publicar<span className="sr-only">: {sugerencia.titulo}</span>
            </button>
          ) : (
            <button type="button" disabled={procesando} onClick={() => ejecutar(() => aceptarSugerencia(sugerencia.id))} className={CLASE_BOTON_PRIMARIO}>
              <Check className="size-3.5" aria-hidden="true" />
              Aceptar<span className="sr-only">: {sugerencia.titulo ?? sugerencia.texto}</span>
            </button>
          )}
          <button type="button" disabled={procesando} onClick={() => ejecutar(() => descartarSugerencia(sugerencia.id))} className={CLASE_BOTON}>
            <X className="size-3.5" aria-hidden="true" />
            Descartar<span className="sr-only">: {sugerencia.titulo ?? sugerencia.texto}</span>
          </button>
        </div>
      )}

      {sugerencia.afectacionCreadaId && (
        <Link href={`/tr/afectaciones/${sugerencia.afectacionCreadaId}`} className="text-sm font-semibold text-primary underline-offset-2 hover:underline">
          Ver la afectación publicada
        </Link>
      )}
    </li>
  )
}

export function SugerenciasLista() {
  const hidratado = useHidratado()
  const sugerencias = useDemoStore((s) => s.sugerencias)
  const [mensaje, setMensaje] = useState<ResultadoSugerencia | null>(null)

  const { pendientes, resueltas } = useMemo(() => {
    const porFecha = [...sugerencias].sort((a, b) => Date.parse(b.creadaEn) - Date.parse(a.creadaEn))
    return { pendientes: porFecha.filter((s) => s.estado === 'pendiente'), resueltas: porFecha.filter((s) => s.estado !== 'pendiente') }
  }, [sugerencias])

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 lg:p-8">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-balance text-2xl font-bold">Sugerencias IA</h1>
          <EtiquetaSimulado />
        </div>
        <p className="text-pretty text-sm text-muted-foreground">
          La IA sugiere y el operador decide. Una sugerencia aprobada crea una afectación publicada con fuente «Análisis de cámara (demo)» y confiabilidad estimada.
        </p>
      </header>

      {mensaje && (
        <p
          role="status"
          className={`rounded-md border p-3 text-sm font-medium ${mensaje.ok ? 'border-primary bg-secondary text-primary' : 'border-destructive text-destructive'}`}
        >
          {mensaje.mensaje}
        </p>
      )}

      {!hidratado ? (
        <p className="text-sm text-muted-foreground">Cargando sugerencias…</p>
      ) : (
        <>
          <section aria-labelledby="titulo-pendientes" className="flex flex-col gap-3">
            <h2 id="titulo-pendientes" className="text-lg font-bold">
              Pendientes ({pendientes.length})
            </h2>
            {pendientes.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                No hay sugerencias pendientes. El{' '}
                <Link href="/tr/laboratorio" className="font-semibold text-primary underline-offset-2 hover:underline">
                  Laboratorio de análisis
                </Link>{' '}
                genera una cuando la congestión se sostiene.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {pendientes.map((s) => (
                  <TarjetaSugerencia key={s.id} sugerencia={s} onResultado={setMensaje} />
                ))}
              </ul>
            )}
          </section>

          {resueltas.length > 0 && (
            <section aria-labelledby="titulo-resueltas" className="flex flex-col gap-3">
              <h2 id="titulo-resueltas" className="text-lg font-bold">
                Resueltas ({resueltas.length})
              </h2>
              <ul className="flex flex-col gap-3">
                {resueltas.map((s) => (
                  <TarjetaSugerencia key={s.id} sugerencia={s} onResultado={setMensaje} />
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  )
}
