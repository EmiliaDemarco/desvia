import type { TipoAfectacion } from './types'

export const TIPOS_AFECTACION: TipoAfectacion[] = ['obra', 'corte', 'poda', 'accidente', 'congestion', 'evento']

export const ETIQUETA_TIPO: Record<TipoAfectacion, string> = {
  obra: 'Obras',
  corte: 'Cortes',
  poda: 'Podas',
  accidente: 'Accidentes',
  congestion: 'Congestión',
  evento: 'Eventos',
}

const formateador = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'America/Argentina/Buenos_Aires',
})

// dd/mm hh:mm, siempre en hora de Buenos Aires para evitar diferencias entre servidor y navegador.
export function formatearFechaHora(iso: string): string {
  const partes = Object.fromEntries(formateador.formatToParts(new Date(iso)).map((parte) => [parte.type, parte.value]))
  return `${partes.day}/${partes.month} ${partes.hour}:${partes.minute}`
}
