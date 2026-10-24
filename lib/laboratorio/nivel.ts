export type NivelCola = 'fluido' | 'moderado' | 'congestionado'

export interface Umbrales {
  /** Promedio de vehículos desde el cual el nivel pasa a moderado. */
  moderado: number
  /** Promedio de vehículos desde el cual el nivel pasa a congestionado. */
  congestionado: number
}

export const UMBRALES_POR_DEFECTO: Umbrales = { moderado: 4, congestionado: 8 }

export const NOMBRE_NIVEL: Record<NivelCola, string> = {
  fluido: 'Fluido',
  moderado: 'Moderado',
  congestionado: 'Congestionado',
}

export const SEGUNDOS_PARA_SUGERIR = 30
export const SEGUNDOS_PROMEDIO = 60
export const SEGUNDOS_GRAFICO = 120
export const SEGUNDOS_ESPERA_MODELO = 10

export const CLASES_VEHICULO = ['car', 'truck', 'bus', 'motorcycle'] as const
export const NOMBRE_CLASE: Record<string, string> = {
  car: 'auto',
  truck: 'camión',
  bus: 'ómnibus',
  motorcycle: 'moto',
}

export interface MuestraCola {
  conteo: number
  promedio: number
}

export function calcularNivel(promedio: number, umbrales: Umbrales): NivelCola {
  if (promedio >= umbrales.congestionado) return 'congestionado'
  if (promedio >= umbrales.moderado) return 'moderado'
  return 'fluido'
}

export function umbralesValidos({ moderado, congestionado }: Umbrales): boolean {
  return Number.isFinite(moderado) && Number.isFinite(congestionado) && moderado >= 1 && congestionado > moderado
}

export function promedioReciente(conteos: number[]): number {
  const ventana = conteos.slice(-SEGUNDOS_PROMEDIO)
  return ventana.length ? ventana.reduce((suma, valor) => suma + valor, 0) / ventana.length : 0
}

export function formatearPromedio(valor: number): string {
  return valor.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

// Sin datos de detección reales (modo respaldo) la confianza se estima según cuánto supera el umbral.
export function estimarConfianza(promedio: number, umbrales: Umbrales, puntajeModelo: number | null): number {
  if (puntajeModelo !== null) return Math.min(0.95, Math.max(0.5, puntajeModelo))
  const exceso = Math.min(1, Math.max(0, (promedio - umbrales.congestionado) / umbrales.congestionado))
  return Math.min(0.9, 0.55 + 0.35 * exceso)
}
