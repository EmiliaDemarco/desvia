'use client'

import { useId, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  formatearPromedio,
  NOMBRE_NIVEL,
  SEGUNDOS_PARA_SUGERIR,
  umbralesValidos,
  type NivelCola,
  type Umbrales,
} from '@/lib/laboratorio/nivel'

const PUNTO_NIVEL: Record<NivelCola, string> = {
  fluido: 'bg-primary',
  moderado: 'bg-(--aviso)',
  congestionado: 'bg-destructive',
}

export function InsigniaNivel({ nivel }: { nivel: NivelCola }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm font-bold">
      <span className={`size-2.5 rounded-full ${PUNTO_NIVEL[nivel]}`} aria-hidden="true" />
      {NOMBRE_NIVEL[nivel]}
    </span>
  )
}

interface PanelMetricasProps {
  conteo: number
  promedio: number
  nivel: NivelCola
  segundosCongestion: number
  umbrales: Umbrales
  onUmbrales: (umbrales: Umbrales) => void
  midiendo: boolean
}

export function PanelMetricas({ conteo, promedio, nivel, segundosCongestion, umbrales, onUmbrales, midiendo }: PanelMetricasProps) {
  const idModerado = useId()
  const idCongestionado = useId()
  const idError = useId()
  const [textoModerado, setTextoModerado] = useState(String(umbrales.moderado))
  const [textoCongestionado, setTextoCongestionado] = useState(String(umbrales.congestionado))

  const candidatos = { moderado: Number(textoModerado), congestionado: Number(textoCongestionado) }
  const invalidos = !umbralesValidos(candidatos)

  function cambiar(campo: keyof Umbrales, texto: string) {
    if (campo === 'moderado') setTextoModerado(texto)
    else setTextoCongestionado(texto)
    const siguiente = { moderado: Number(campo === 'moderado' ? texto : textoModerado), congestionado: Number(campo === 'congestionado' ? texto : textoCongestionado) }
    if (umbralesValidos(siguiente)) onUmbrales(siguiente)
  }

  const progreso = Math.min(100, (segundosCongestion / SEGUNDOS_PARA_SUGERIR) * 100)

  return (
    <div className="flex flex-col gap-4">
      <section aria-label="Medición de la zona de cola" className="grid grid-cols-2 gap-3">
        <Card className="gap-1 py-4">
          <CardHeader className="px-4">
            <CardDescription className="text-xs font-semibold uppercase tracking-wide">En la zona ahora</CardDescription>
            <CardTitle className="text-4xl font-bold tabular-nums">{conteo}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 text-xs text-muted-foreground">vehículos</CardContent>
        </Card>
        <Card className="gap-1 py-4">
          <CardHeader className="px-4">
            <CardDescription className="text-xs font-semibold uppercase tracking-wide">Promedio último minuto</CardDescription>
            <CardTitle className="text-4xl font-bold tabular-nums">{formatearPromedio(promedio)}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 text-xs text-muted-foreground">vehículos por segundo medido</CardContent>
        </Card>
      </section>

      <Card className="gap-3 py-4">
        <CardHeader className="px-4">
          <CardDescription className="text-xs font-semibold uppercase tracking-wide">Nivel de la cola</CardDescription>
          <div aria-live="polite" className="flex flex-wrap items-center gap-3">
            <InsigniaNivel nivel={nivel} />
            {!midiendo && <span className="text-xs text-muted-foreground">Sin medición todavía</span>}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 px-4">
          <div className="flex items-baseline justify-between gap-2 text-xs">
            <span className="font-medium">Congestión sostenida</span>
            <span className="tabular-nums text-muted-foreground">
              {Math.min(segundosCongestion, SEGUNDOS_PARA_SUGERIR)} de {SEGUNDOS_PARA_SUGERIR} s
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Segundos de congestión sostenida para generar una sugerencia"
            aria-valuemin={0}
            aria-valuemax={SEGUNDOS_PARA_SUGERIR}
            aria-valuenow={Math.min(segundosCongestion, SEGUNDOS_PARA_SUGERIR)}
            className="h-2 overflow-hidden rounded-full bg-muted"
          >
            <div className="h-full bg-destructive transition-[width] duration-500" style={{ width: `${progreso}%` }} />
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Si el nivel se mantiene congestionado durante {SEGUNDOS_PARA_SUGERIR} s, se genera una sugerencia para que el operador la revise.
          </p>
        </CardContent>
      </Card>

      <Card className="gap-3 py-4">
        <CardHeader className="px-4">
          <CardTitle className="text-base">Umbrales del nivel</CardTitle>
          <CardDescription>Se comparan con el promedio del último minuto.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 px-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={idModerado} className="text-xs font-semibold">
                Moderado desde
              </label>
              <input
                id={idModerado}
                type="number"
                inputMode="decimal"
                min={1}
                step={0.5}
                value={textoModerado}
                onChange={(e) => cambiar('moderado', e.target.value)}
                aria-invalid={invalidos}
                aria-describedby={invalidos ? idError : undefined}
                className="min-h-10 rounded-md border border-input bg-card px-3 text-sm tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={idCongestionado} className="text-xs font-semibold">
                Congestionado desde
              </label>
              <input
                id={idCongestionado}
                type="number"
                inputMode="decimal"
                min={1}
                step={0.5}
                value={textoCongestionado}
                onChange={(e) => cambiar('congestionado', e.target.value)}
                aria-invalid={invalidos}
                aria-describedby={invalidos ? idError : undefined}
                className="min-h-10 rounded-md border border-input bg-card px-3 text-sm tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          {invalidos ? (
            <p id={idError} role="alert" className="text-xs font-medium text-destructive">
              El umbral de congestión debe ser mayor que el moderado, y ambos de 1 o más. Mientras tanto se usan {umbrales.moderado} y {umbrales.congestionado}.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Fluido por debajo de {umbrales.moderado}; moderado entre {umbrales.moderado} y {umbrales.congestionado}; congestionado desde {umbrales.congestionado}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
