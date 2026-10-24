// Reemplazar por API real de la Municipalidad cuando esté autorizada.
import { useDemoStore } from '../store'
import type { Notificacion } from '../types'

export async function listarNotificaciones(): Promise<Notificacion[]> { return useDemoStore.getState().notificaciones }
export async function marcarNotificacionLeida(id: string): Promise<void> { useDemoStore.getState().setNotificaciones(useDemoStore.getState().notificaciones.map((item) => item.id === id ? { ...item, leida: true } : item)) }
