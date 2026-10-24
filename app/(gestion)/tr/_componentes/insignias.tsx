import { NOMBRE_ESTADO, NOMBRE_PUBLICACION } from '@/lib/formato'
import type { Estado, Publicacion } from '@/lib/types'

const BASE = 'inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold'

const CLASE_ESTADO: Record<Estado, string> = {
  activa: 'bg-primary text-primary-foreground',
  programada: 'bg-secondary text-secondary-foreground ring-1 ring-border',
  resuelta: 'bg-muted text-muted-foreground',
  cancelada: 'bg-muted text-muted-foreground line-through',
}

const CLASE_PUBLICACION: Record<Publicacion, string> = {
  publicada: 'bg-secondary text-primary ring-1 ring-primary',
  programada: 'bg-secondary text-secondary-foreground ring-1 ring-border',
  borrador: 'border border-dashed border-muted-foreground text-muted-foreground',
}

export function InsigniaEstado({ estado }: { estado: Estado }) {
  return <span className={`${BASE} ${CLASE_ESTADO[estado]}`}>{NOMBRE_ESTADO[estado]}</span>
}

export function InsigniaPublicacion({ publicacion }: { publicacion: Publicacion }) {
  return <span className={`${BASE} ${CLASE_PUBLICACION[publicacion]}`}>{NOMBRE_PUBLICACION[publicacion]}</span>
}
