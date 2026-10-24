import type { Coordenada } from './engine'

export const AHORA_SIMULADO = new Date('2026-10-24T12:20:00-03:00')
export const INTERVALO_PASO_MS = 400
export const PASOS_POR_TRAMO = 4
export const MS_SIMULADOS_POR_PASO = 30_000

// Trazado esquemático por Av. Pellegrini, de Av. Francia hacia el Parque Independencia. DATO SIMULADO.
export const RUTA_PELLEGRINI: Array<[number, number]> = [
  [-32.9512, -60.669],
  [-32.9519, -60.6678],
  [-32.9526, -60.6666],
  [-32.9533, -60.6654],
  [-32.954, -60.6642],
  [-32.9547, -60.663],
  [-32.9553, -60.662],
  [-32.956, -60.6611],
  [-32.9566, -60.6603],
  [-32.9572, -60.6596],
]

export const TOTAL_PASOS = (RUTA_PELLEGRINI.length - 1) * PASOS_POR_TRAMO

export function posicionEnPaso(paso: number): Coordenada {
  const avance = Math.min(Math.max(paso, 0), TOTAL_PASOS) / PASOS_POR_TRAMO
  const tramo = Math.min(Math.floor(avance), RUTA_PELLEGRINI.length - 2)
  const fraccion = avance - tramo
  const [latA, lonA] = RUTA_PELLEGRINI[tramo]
  const [latB, lonB] = RUTA_PELLEGRINI[tramo + 1]
  return { latitud: latA + (latB - latA) * fraccion, longitud: lonA + (lonB - lonA) * fraccion }
}
