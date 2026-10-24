'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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
  setNotificaciones: (notificaciones: Notificacion[]) => void
  setPreferencias: (preferencias: Preferencias) => void
  setHistorial: (historial: CambioHistorial[]) => void
  setSugerencias: (sugerencias: SugerenciaIA[]) => void
  resetDemo: () => void
}

export const useDemoStore = create<DemoStore>()(persist((set) => ({
  usuarioActual: null,
  setUsuarioActual: (usuarioActual) => set({ usuarioActual }),
  afectaciones: afectacionesIniciales,
  notificaciones: notificacionesIniciales,
  preferencias: preferenciasIniciales,
  historial: [],
  sugerencias: sugerenciasIniciales,
  setAfectaciones: (afectaciones) => set({ afectaciones }),
  setNotificaciones: (notificaciones) => set({ notificaciones }),
  setPreferencias: (preferencias) => set({ preferencias }),
  setHistorial: (historial) => set({ historial }),
  setSugerencias: (sugerencias) => set({ sugerencias }),
  resetDemo: () => set({ afectaciones: afectacionesIniciales, notificaciones: notificacionesIniciales, preferencias: preferenciasIniciales, historial: [], sugerencias: sugerenciasIniciales }),
}), {
  name: 'desvia-demo-store',
  version: 3,
  migrate: (persisted) => ({ ...(persisted as DemoStore), preferencias: preferenciasIniciales, notificaciones: notificacionesIniciales }),
}))
