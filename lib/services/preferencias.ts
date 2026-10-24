// Reemplazar por API real de la Municipalidad cuando esté autorizada.
import { useDemoStore } from '../store'
import type { Preferencias } from '../types'

export async function obtenerPreferencias(): Promise<Preferencias> { return useDemoStore.getState().preferencias }
export async function actualizarPreferencias(cambios: Partial<Preferencias>): Promise<Preferencias> { const preferencias = { ...useDemoStore.getState().preferencias, ...cambios }; useDemoStore.getState().setPreferencias(preferencias); return preferencias }
