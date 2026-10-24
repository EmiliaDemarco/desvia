'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { descomponerDireccion } from './gestion/direccion'
import { afectacionesIniciales, notificacionesIniciales, preferenciasIniciales, sugerenciasIniciales } from './mock-data'
import type { Afectacion, CambioHistorial, Notificacion, Preferencias, SugerenciaIA, UsuarioDemo } from './types'

type DemoStore = {
  usuarioActual: UsuarioDemo | null
  setUsuarioActual: (usuario: UsuarioDemo | null) => void
  afectaciones: Afectacion[]
  notificaciones: Notificacion[]
  preferencias: Preferencias
  historial: CambioHistorial[]
  sugerencias: SugerenciaIA[]
  setAfectaciones: (afectaciones: Afectacion[]) => void
  /** Guarda las afectaciones y su rastro de auditoría en una sola actualización. */
  registrarCambioAfectaciones: (afectaciones: Afectacion[], cambios: CambioHistorial[]) => void
  setNotificaciones: (notificaciones: Notificacion[]) => void
  setPreferencias: (preferencias: Preferencias) => void
  setHistorial: (historial: CambioHistorial[]) => void
  setSugerencias: (sugerencias: SugerenciaIA[]) => void
  resetDemo: () => void
}

const NOMBRE_STORE = 'desvia-demo-store'

// Las afectaciones guardadas antes de la gestión no tienen publicación ni la dirección separada.
function completarAfectacion(guardada: Afectacion): Afectacion {
  if (guardada.publicacion) return guardada
  return { ...descomponerDireccion(guardada.direccion), ...guardada, publicacion: 'publicada' }
}

export const useDemoStore = create<DemoStore>()(persist((set, get) => ({
  usuarioActual: null,
  setUsuarioActual: (usuarioActual) => set({ usuarioActual }),
  afectaciones: afectacionesIniciales,
  notificaciones: notificacionesIniciales,
  preferencias: preferenciasIniciales,
  historial: [],
  sugerencias: sugerenciasIniciales,
  setAfectaciones: (afectaciones) => set({ afectaciones }),
  registrarCambioAfectaciones: (afectaciones, cambios) => set({ afectaciones, historial: [...get().historial, ...cambios] }),
  setNotificaciones: (notificaciones) => set({ notificaciones }),
  setPreferencias: (preferencias) => set({ preferencias }),
  setHistorial: (historial) => set({ historial }),
  setSugerencias: (sugerencias) => set({ sugerencias }),
  resetDemo: () => set({ afectaciones: afectacionesIniciales, notificaciones: notificacionesIniciales, preferencias: preferenciasIniciales, historial: [], sugerencias: sugerenciasIniciales }),
}), {
  name: NOMBRE_STORE,
  version: 4,
  migrate: (persistido, version) => {
    const previo = persistido as Partial<DemoStore>
    return {
      ...previo,
      afectaciones: (previo.afectaciones ?? afectacionesIniciales).map(completarAfectacion),
      historial: (previo.historial ?? []).map((cambio) => ({ ...cambio, usuario: cambio.usuario ?? 'Sistema (demo)' })),
      // Antes de la v3 las preferencias tenían otra forma.
      ...(version < 3 ? { preferencias: preferenciasIniciales, notificaciones: notificacionesIniciales } : {}),
    } as DemoStore
  },
}))

// Panel y experiencia ciudadana en pestañas distintas: lo que se guarda en una se refleja en la otra.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (evento) => {
    if (evento.key === NOMBRE_STORE) void useDemoStore.persist.rehydrate()
  })
}
