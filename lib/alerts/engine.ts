import type { Afectacion, Preferencias, ZonaHabitual } from '../types'

export interface Coordenada {
  latitud: number
  longitud: number
}

export type MotivoAlerta = 'nueva' | 'actualizacion'

export interface AlertaEvaluada {
  afectacion: Afectacion
  distanciaM: number
  motivo: MotivoAlerta
}

export interface RegistroNotificada {
  firma: string
  actualizacionNotificada: boolean
}

export type YaNotificadas = Record<string, RegistroNotificada>

export const RADIO_ANTICIPACION_POR_DEFECTO_M = 1000
export const VENTANA_PROGRAMADA_MS = 2 * 60 * 60 * 1000

const RADIO_TIERRA_M = 6371008.8
const aRadianes = (grados: number) => (grados * Math.PI) / 180

export function distanciaHaversineM(a: Coordenada, b: Coordenada): number {
  const dLat = aRadianes(b.latitud - a.latitud)
  const dLon = aRadianes(b.longitud - a.longitud)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(aRadianes(a.latitud)) * Math.cos(aRadianes(b.latitud)) * Math.sin(dLon / 2) ** 2
  return 2 * RADIO_TIERRA_M * Math.asin(Math.min(1, Math.sqrt(h)))
}

export function afectacionEnZonas(punto: Coordenada, zonas: ZonaHabitual[]): boolean {
  return zonas.some((zona) => distanciaHaversineM(zona, punto) <= zona.radioM)
}

// Cambios de horario o de impacto: lo que justifica una única alerta de "actualización".
export function firmaAfectacion(afectacion: Afectacion): string {
  return `${afectacion.inicio}|${afectacion.fin ?? ''}|${afectacion.impacto}`
}

function estaVigente(afectacion: Afectacion, ahora: Date): boolean {
  if (afectacion.estado === 'activa') return true
  if (afectacion.estado !== 'programada') return false
  // Una programada cuyo inicio ya pasó sin que el operador la active igual se considera inminente.
  return Date.parse(afectacion.inicio) - ahora.getTime() < VENTANA_PROGRAMADA_MS
}

function motivoDeAlerta(afectacion: Afectacion, yaNotificadas: YaNotificadas): MotivoAlerta | null {
  const registro = yaNotificadas[afectacion.id]
  if (!registro) return 'nueva'
  if (registro.actualizacionNotificada) return null
  return registro.firma !== firmaAfectacion(afectacion) ? 'actualizacion' : null
}

export function evaluarAlertas(
  posicion: Coordenada,
  afectaciones: Afectacion[],
  preferencias: Preferencias,
  yaNotificadas: YaNotificadas,
  ahora: Date = new Date(),
): AlertaEvaluada[] {
  // En el prototipo solo existe el aviso con la app abierta; los otros modos se guardan pero no generan alertas.
  if (!preferencias.recibirNotificaciones || !preferencias.modosAviso.appAbierta) return []
  const radioM = preferencias.radioAnticipacionM ?? RADIO_ANTICIPACION_POR_DEFECTO_M

  const alertas: AlertaEvaluada[] = []
  for (const afectacion of afectaciones) {
    if (!preferencias.tiposSeguidos.includes(afectacion.tipo)) continue
    if (!estaVigente(afectacion, ahora)) continue
    if (preferencias.soloAltoImpacto && afectacion.impacto !== 'alto') continue

    const distanciaM = distanciaHaversineM(posicion, afectacion)
    if (distanciaM > radioM) continue

    const motivo = motivoDeAlerta(afectacion, yaNotificadas)
    if (motivo) alertas.push({ afectacion, distanciaM, motivo })
  }
  return alertas.sort((x, y) => x.distanciaM - y.distanciaM)
}

export function registrarNotificadas(yaNotificadas: YaNotificadas, alertas: AlertaEvaluada[]): YaNotificadas {
  const siguiente: YaNotificadas = { ...yaNotificadas }
  for (const { afectacion, motivo } of alertas) {
    siguiente[afectacion.id] = {
      firma: firmaAfectacion(afectacion),
      actualizacionNotificada: motivo === 'actualizacion' || (yaNotificadas[afectacion.id]?.actualizacionNotificada ?? false),
    }
  }
  return siguiente
}
