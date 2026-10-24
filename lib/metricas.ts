import { ETIQUETA_TIPO, TIPOS_AFECTACION } from './formato'
import type { Afectacion, Notificacion, TipoAfectacion } from './types'

const MS_DIA = 86_400_000
const DIAS_SERIE = 7

// en-CA formatea como AAAA-MM-DD; se fija la zona para que servidor y navegador agrupen igual.
const formatoDia = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Argentina/Buenos_Aires',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const claveDia = (fecha: Date | string) => formatoDia.format(new Date(fecha))

function ultimosDias(ahora: Date, cantidad: number): string[] {
  const [anio, mes, dia] = claveDia(ahora).split('-').map(Number)
  const base = Date.UTC(anio, mes - 1, dia)
  return Array.from({ length: cantidad }, (_, i) => new Date(base - (cantidad - 1 - i) * MS_DIA).toISOString().slice(0, 10))
}

const etiquetaDia = (clave: string) => `${clave.slice(8, 10)}/${clave.slice(5, 7)}`

export interface Metricas {
  activas: number
  programadas: number
  proximasAFinalizar: number
  alertasGeneradas: number
  porTipo: Array<{ tipo: TipoAfectacion; etiqueta: string; cantidad: number }>
  porDia: Array<{ dia: string; afectaciones: number; alertas: number }>
}

export function calcularMetricas(afectaciones: Afectacion[], notificaciones: Notificacion[], ahora: Date): Metricas {
  const activas = afectaciones.filter((a) => a.estado === 'activa')
  const programadas = afectaciones.filter((a) => a.estado === 'programada')
  const proximasAFinalizar = activas.filter((a) => {
    if (!a.fin) return false
    const restanteMs = new Date(a.fin).getTime() - ahora.getTime()
    return restanteMs > 0 && restanteMs < MS_DIA
  })

  const vigentesORegistradas = afectaciones.filter((a) => a.estado !== 'cancelada')
  const porTipo = TIPOS_AFECTACION.map((tipo) => ({
    tipo,
    etiqueta: ETIQUETA_TIPO[tipo],
    cantidad: vigentesORegistradas.filter((a) => a.tipo === tipo).length,
  }))

  const afectacionesPorDia = new Map<string, number>()
  for (const a of afectaciones) afectacionesPorDia.set(claveDia(a.inicio), (afectacionesPorDia.get(claveDia(a.inicio)) ?? 0) + 1)
  const alertasPorDia = new Map<string, number>()
  for (const n of notificaciones) alertasPorDia.set(claveDia(n.creadaEn), (alertasPorDia.get(claveDia(n.creadaEn)) ?? 0) + 1)

  const porDia = ultimosDias(ahora, DIAS_SERIE).map((clave) => ({
    dia: etiquetaDia(clave),
    afectaciones: afectacionesPorDia.get(clave) ?? 0,
    alertas: alertasPorDia.get(clave) ?? 0,
  }))

  return {
    activas: activas.length,
    programadas: programadas.length,
    proximasAFinalizar: proximasAFinalizar.length,
    alertasGeneradas: notificaciones.length,
    porTipo,
    porDia,
  }
}
