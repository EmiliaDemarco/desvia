import { distanciaHaversineM } from '../alerts/engine'
import { zonasPredefinidas } from '../mock-data'

const RADIO_MAXIMO_M = 1500

export function zonaMasCercana(latitud: number, longitud: number): string {
  let mejor = { nombre: 'Rosario', distanciaM: Infinity }
  for (const zona of zonasPredefinidas) {
    const distanciaM = distanciaHaversineM(zona, { latitud, longitud })
    if (distanciaM < mejor.distanciaM) mejor = { nombre: zona.nombre, distanciaM }
  }
  return mejor.distanciaM <= RADIO_MAXIMO_M ? mejor.nombre : 'Rosario'
}
