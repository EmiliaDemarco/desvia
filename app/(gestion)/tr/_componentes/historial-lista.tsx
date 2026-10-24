import Link from 'next/link'
import { formatearFechaHora } from '@/lib/formato'
import type { CambioHistorial } from '@/lib/types'

interface HistorialListaProps {
  cambios: CambioHistorial[]
  /** Títulos por id de afectación; si se pasa, cada registro enlaza a su afectación. */
  titulos?: Record<string, string>
  vacio?: string
}

const ETIQUETA_ENTIDAD: Record<CambioHistorial['entidad'], string> = {
  afectacion: 'Afectación',
  notificacion: 'Notificación',
  preferencias: 'Preferencias',
  sugerencia: 'Sugerencia IA',
}

export function HistorialLista({ cambios, titulos, vacio = 'Todavía no hay cambios registrados.' }: HistorialListaProps) {
  if (cambios.length === 0) return <p className="text-sm text-muted-foreground">{vacio}</p>

  return (
    <ol className="flex flex-col gap-2">
      {cambios.map((cambio) => {
        const titulo = titulos?.[cambio.entidadId]
        return (
          <li key={cambio.id} className="flex flex-col gap-1.5 rounded-lg border border-border bg-card p-3 text-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="font-semibold">
                {cambio.accion}
                {cambio.campo && cambio.accion !== 'Creación' ? ` · ${cambio.campo}` : ''}
              </span>
              <time dateTime={cambio.fecha} className="text-xs tabular-nums text-muted-foreground">
                {formatearFechaHora(cambio.fecha)}
              </time>
            </div>

            {cambio.accion === 'Creación' ? (
              <p>Se creó «{cambio.valorNuevo}».</p>
            ) : cambio.campo ? (
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
                  <span className="sr-only">Valor anterior: </span>
                  {cambio.valorAnterior}
                </span>
                <span aria-hidden="true">→</span>
                <span className="sr-only">Valor nuevo: </span>
                <span className="rounded bg-secondary px-1.5 py-0.5 font-medium">{cambio.valorNuevo}</span>
              </p>
            ) : (
              <p>{cambio.detalle}</p>
            )}

            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>Por {cambio.usuario}</span>
              {titulo ? (
                <Link href={`/tr/afectaciones/${cambio.entidadId}`} className="font-medium text-primary underline-offset-2 hover:underline">
                  {titulo}
                </Link>
              ) : (
                titulos && <span>{ETIQUETA_ENTIDAD[cambio.entidad]}</span>
              )}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
