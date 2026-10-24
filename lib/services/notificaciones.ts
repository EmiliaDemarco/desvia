// Reemplazar por API real de la Municipalidad cuando esté autorizada.
import type { AlertaEvaluada } from '../alerts/engine'
import { ETIQUETA_TIPO } from '../formato'
import { useDemoStore } from '../store'
import type { Notificacion } from '../types'

export async function listarNotificaciones(): Promise<Notificacion[]> { return useDemoStore.getState().notificaciones }
export async function marcarNotificacionLeida(id: string): Promise<void> { useDemoStore.getState().setNotificaciones(useDemoStore.getState().notificaciones.map((item) => item.id === id ? { ...item, leida: true } : item)) }
export async function marcarTodasLeidas(): Promise<void> { useDemoStore.getState().setNotificaciones(useDemoStore.getState().notificaciones.map((item) => ({ ...item, leida: true }))) }

const distanciaAproximada = (metros: number) => Math.max(50, Math.round(metros / 50) * 50)

// Cada alerta del motor deja una notificación en el centro. Si el recorrido se repite, la anterior se reemplaza y vuelve a figurar sin leer.
export async function registrarNotificacionesDeAlertas(alertas: AlertaEvaluada[], recibidaEn: Date): Promise<void> {
  const nuevas: Notificacion[] = alertas.map(({ afectacion, distanciaM, motivo }) => ({
    id: `not-sim-${afectacion.id}-${motivo}`,
    titulo: motivo === 'nueva' ? `${ETIQUETA_TIPO[afectacion.tipo]} cerca tuyo` : `Actualización: ${afectacion.titulo}`,
    mensaje:
      motivo === 'nueva'
        ? `${afectacion.titulo} en ${afectacion.direccion}, a aprox. ${distanciaAproximada(distanciaM)} m.`
        : `Cambió el horario o el impacto de la afectación en ${afectacion.direccion}.`,
    leida: false,
    creadaEn: recibidaEn.toISOString(),
    afectacionId: afectacion.id,
    tipo: afectacion.tipo,
    esDatoSimulado: true,
  }))
  const idsNuevos = new Set(nuevas.map((item) => item.id))
  const conservadas = useDemoStore.getState().notificaciones.filter((item) => !idsNuevos.has(item.id))
  useDemoStore.getState().setNotificaciones([...nuevas, ...conservadas])
}
