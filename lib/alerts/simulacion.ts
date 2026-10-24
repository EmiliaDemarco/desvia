import type { Coordenada } from './engine'

export const AHORA_SIMULADO = new Date('2026-10-24T12:20:00-03:00')
export const INTERVALO_PASO_MS = 400
export const PASOS_POR_TRAMO = 4
export const MS_SIMULADOS_POR_PASO = 30_000

// Trazado esquemático desde el Monumento a la Bandera hasta Córdoba y Bv. Oroño, por calle Córdoba. DATO SIMULADO.
export const RUTA_JUAN: Array<[number, number]> = [
  [-32.9477, -60.6304],
  [-32.9474, -60.6325],
  [-32.9471, -60.6347],
  [-32.9467, -60.637],
  [-32.9463, -60.639],
  [-32.9465, -60.6412],
  [-32.9468, -60.6439],
  [-32.9471, -60.6467],
  [-32.9475, -60.649],
  [-32.9479, -60.6511],
  [-32.9485, -60.6532],
]

export const TOTAL_PASOS = (RUTA_JUAN.length - 1) * PASOS_POR_TRAMO

export function posicionEnPaso(paso: number): Coordenada {
  const avance = Math.min(Math.max(paso, 0), TOTAL_PASOS) / PASOS_POR_TRAMO
  const tramo = Math.min(Math.floor(avance), RUTA_JUAN.length - 2)
  const fraccion = avance - tramo
  const [latA, lonA] = RUTA_JUAN[tramo]
  const [latB, lonB] = RUTA_JUAN[tramo + 1]
  return { latitud: latA + (latB - latA) * fraccion, longitud: lonA + (lonB - lonA) * fraccion }
}
