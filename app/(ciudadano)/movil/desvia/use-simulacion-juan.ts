'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { evaluarAlertas, registrarNotificadas, type AlertaEvaluada, type YaNotificadas } from '@/lib/alerts/engine'
import { AHORA_SIMULADO, INTERVALO_PASO_MS, posicionEnPaso, TOTAL_PASOS } from '@/lib/alerts/simulacion'
import type { Afectacion, Preferencias } from '@/lib/types'

export type EstadoSimulacion = 'inactiva' | 'corriendo' | 'pausada' | 'finalizada'

export interface AlertaActiva {
  principal: AlertaEvaluada
  adicionales: number
}

export function useSimulacionJuan({ afectaciones, preferencias }: { afectaciones: Afectacion[]; preferencias: Preferencias }) {
  const [estado, setEstado] = useState<EstadoSimulacion>('inactiva')
  const [paso, setPaso] = useState(0)
  const [alerta, setAlerta] = useState<AlertaActiva | null>(null)
  const [reinicioId, setReinicioId] = useState(0)

  const pasoRef = useRef(0)
  const notificadasRef = useRef<YaNotificadas>({})
  const datosRef = useRef({ afectaciones, preferencias })

  useEffect(() => {
    datosRef.current = { afectaciones, preferencias }
  }, [afectaciones, preferencias])

  const evaluarEnPaso = useCallback((pasoActual: number) => {
    const { afectaciones: actuales, preferencias: prefs } = datosRef.current
    const resultado = evaluarAlertas(posicionEnPaso(pasoActual), actuales, prefs, notificadasRef.current, AHORA_SIMULADO)
    if (resultado.length === 0) return
    notificadasRef.current = registrarNotificadas(notificadasRef.current, resultado)
    setAlerta({ principal: resultado[0], adicionales: resultado.length - 1 })
  }, [])

  useEffect(() => {
    if (estado !== 'corriendo') return
    const intervalo = setInterval(() => {
      const siguiente = Math.min(pasoRef.current + 1, TOTAL_PASOS)
      pasoRef.current = siguiente
      setPaso(siguiente)
      evaluarEnPaso(siguiente)
      if (siguiente >= TOTAL_PASOS) setEstado('finalizada')
    }, INTERVALO_PASO_MS)
    return () => clearInterval(intervalo)
  }, [estado, evaluarEnPaso])

  const iniciar = useCallback(() => {
    pasoRef.current = 0
    notificadasRef.current = {}
    setPaso(0)
    setAlerta(null)
    setReinicioId((id) => id + 1)
    evaluarEnPaso(0)
    setEstado('corriendo')
  }, [evaluarEnPaso])

  const alternarPausa = useCallback(() => {
    setEstado((actual) => (actual === 'corriendo' ? 'pausada' : actual === 'pausada' ? 'corriendo' : actual))
  }, [])

  const descartarAlerta = useCallback(() => setAlerta(null), [])

  const posicion = estado === 'inactiva' ? null : posicionEnPaso(paso)
  const juan: [number, number] | null = posicion ? [posicion.latitud, posicion.longitud] : null

  return { estado, paso, totalPasos: TOTAL_PASOS, juan, alerta, reinicioId, iniciar, alternarPausa, descartarAlerta }
}
