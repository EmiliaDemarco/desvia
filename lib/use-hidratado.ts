'use client'

import { useSyncExternalStore } from 'react'

const sinSuscripcion = () => () => {}

// Los datos persistidos viven en localStorage: se muestran recién cuando el cliente ya hidrató para no desfasar el HTML del servidor.
export const useHidratado = () => useSyncExternalStore(sinSuscripcion, () => true, () => false)
