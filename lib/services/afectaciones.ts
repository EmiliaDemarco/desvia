// Reemplazar por API real de la Municipalidad cuando esté autorizada.
import { useDemoStore } from '../store'
import type { Afectacion, Estado } from '../types'

export async function listarAfectaciones(): Promise<Afectacion[]> { return useDemoStore.getState().afectaciones }
export async function crearAfectacion(afectacion: Afectacion): Promise<Afectacion> { const items = [...useDemoStore.getState().afectaciones, afectacion]; useDemoStore.getState().setAfectaciones(items); return afectacion }
export async function editarAfectacion(id: string, cambios: Partial<Afectacion>): Promise<Afectacion | undefined> { const actual = useDemoStore.getState().afectaciones.find((item) => item.id === id); if (!actual) return undefined; const editada = { ...actual, ...cambios }; useDemoStore.getState().setAfectaciones(useDemoStore.getState().afectaciones.map((item) => item.id === id ? editada : item)); return editada }
export async function cambiarEstado(id: string, estado: Estado): Promise<Afectacion | undefined> { return editarAfectacion(id, { estado, actualizadaEn: new Date().toISOString() }) }
