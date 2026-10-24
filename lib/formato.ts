import type { Estado, Impacto, Publicacion, TipoAfectacion, TipoCorte } from './types'

export const TIPOS_AFECTACION: TipoAfectacion[] = ['obra', 'corte', 'poda', 'accidente', 'congestion', 'evento']
export const ESTADOS: Estado[] = ['programada', 'activa', 'resuelta', 'cancelada']
export const PUBLICACIONES: Publicacion[] = ['borrador', 'programada', 'publicada']
export const IMPACTOS: Impacto[] = ['bajo', 'medio', 'alto']
export const TIPOS_CORTE: TipoCorte[] = ['parcial', 'total']

export const ETIQUETA_TIPO: Record<TipoAfectacion, string> = {
  obra: 'Obras',
  corte: 'Cortes',
  poda: 'Podas',
  accidente: 'Accidentes',
  congestion: 'Congestión',
  evento: 'Eventos',
}

export const NOMBRE_TIPO: Record<TipoAfectacion, string> = {
  obra: 'Obra',
  corte: 'Corte',
  poda: 'Poda',
  accidente: 'Accidente',
  congestion: 'Congestión',
  evento: 'Evento',
}

export const NOMBRE_ESTADO: Record<Estado, string> = {
  programada: 'Programada',
  activa: 'Activa',
  resuelta: 'Resuelta',
  cancelada: 'Cancelada',
}

export const NOMBRE_PUBLICACION: Record<Publicacion, string> = {
  borrador: 'Borrador',
  programada: 'Programada',
  publicada: 'Publicada',
}

export const NOMBRE_IMPACTO: Record<Impacto, string> = { bajo: 'Bajo', medio: 'Medio', alto: 'Alto' }
export const NOMBRE_CORTE: Record<TipoCorte, string> = { parcial: 'Parcial', total: 'Total' }

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

const formateadorCompleto = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'America/Argentina/Buenos_Aires',
})

// Valor para <input type="datetime-local"> (AAAA-MM-DDTHH:mm) en hora de Buenos Aires.
export function aValorInputFechaHora(iso: string | undefined): string {
  if (!iso) return ''
  const p = Object.fromEntries(formateadorCompleto.formatToParts(new Date(iso)).map((parte) => [parte.type, parte.value]))
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`
}

// Argentina no usa horario de verano: el offset es siempre -03:00.
export function desdeValorInputFechaHora(valor: string): string {
  return valor ? `${valor}:00-03:00` : ''
}
