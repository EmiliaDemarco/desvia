import { distanciaHaversineM, type Coordenada } from './engine'

export const AHORA_SIMULADO = new Date('2026-10-24T12:20:00-03:00')
export const INTERVALO_PASO_MS = 400
export const TOTAL_PASOS = 45
export const MS_SIMULADOS_POR_PASO = 30_000

// Trazado en auto sobre calles reales (OpenStreetMap), del Monumento a la Bandera a Córdoba y Bv. Oroño. Recorrido DATO SIMULADO.
export const RUTA_JUAN: Array<[number, number]> = [
  [-32.94732, -60.63072],
  [-32.94725, -60.63101],
  [-32.94708, -60.63168],
  [-32.94705, -60.63181],
  [-32.94687, -60.63256],
  [-32.94666, -60.63345],
  [-32.94662, -60.6336],
  [-32.94627, -60.63457],
  [-32.94612, -60.63498],
  [-32.94579, -60.63596],
  [-32.94576, -60.63605],
  [-32.94568, -60.63629],
  [-32.94563, -60.63644],
  [-32.94542, -60.63703],
  [-32.94513, -60.63787],
  [-32.94497, -60.6387],
  [-32.94487, -60.63927],
  [-32.94465, -60.64044],
  [-32.94462, -60.64062],
  [-32.94439, -60.64183],
  [-32.94436, -60.64202],
  [-32.94411, -60.6434],
  [-32.94394, -60.64436],
  [-32.94391, -60.64448],
  [-32.94389, -60.6446],
  [-32.94386, -60.64475],
  [-32.94366, -60.64584],
  [-32.9436, -60.64615],
  [-32.94347, -60.64687],
  [-32.94335, -60.64752],
  [-32.94317, -60.64851],
  [-32.94315, -60.6486],
  [-32.94314, -60.64867],
  [-32.94311, -60.64886],
  [-32.943, -60.64948],
  [-32.94298, -60.64956],
  [-32.94285, -60.65026],
  [-32.94267, -60.65126],
  [-32.94261, -60.65159],
  [-32.94244, -60.6526],
  [-32.94242, -60.65266],
  [-32.94238, -60.65288],
  [-32.94237, -60.65296],
  [-32.94235, -60.65309],
  [-32.94357, -60.65338],
  [-32.9436, -60.65338],
]

const distanciasAcumuladas: number[] = RUTA_JUAN.reduce<number[]>((acumuladas, punto, indice) => {
  if (indice === 0) return [0]
  const anterior = RUTA_JUAN[indice - 1]
  const tramo = distanciaHaversineM({ latitud: anterior[0], longitud: anterior[1] }, { latitud: punto[0], longitud: punto[1] })
  return [...acumuladas, acumuladas[indice - 1] + tramo]
}, [])

const LARGO_RUTA_M = distanciasAcumuladas[distanciasAcumuladas.length - 1]

export function posicionEnPaso(paso: number): Coordenada {
  const objetivoM = (Math.min(Math.max(paso, 0), TOTAL_PASOS) / TOTAL_PASOS) * LARGO_RUTA_M
  let tramo = distanciasAcumuladas.findIndex((acumulada) => acumulada >= objetivoM) - 1
  if (tramo < 0) tramo = 0
  const largoTramo = distanciasAcumuladas[tramo + 1] - distanciasAcumuladas[tramo]
  const fraccion = largoTramo === 0 ? 0 : (objetivoM - distanciasAcumuladas[tramo]) / largoTramo
  const [latA, lonA] = RUTA_JUAN[tramo]
  const [latB, lonB] = RUTA_JUAN[tramo + 1]
  return { latitud: latA + (latB - latA) * fraccion, longitud: lonA + (lonB - lonA) * fraccion }
}
