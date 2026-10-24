'use client'

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import type { DetectedObject } from '@tensorflow-models/coco-ssd'
import { puntoEnPoligono, type Punto } from '@/lib/laboratorio/geometria'
import {
  calcularNivel,
  estimarConfianza,
  promedioReciente,
  SEGUNDOS_GRAFICO,
  SEGUNDOS_PARA_SUGERIR,
  type MuestraCola,
  type Umbrales,
} from '@/lib/laboratorio/nivel'
import { dibujarEscena, esVehiculo, puntoDeApoyo } from './dibujo'

export type ModoConteo = 'cargando' | 'vivo' | 'respaldo'

export interface CongestionSostenida {
  promedio: number
  confianza: number
  segundos: number
}

interface Parametros {
  videoRef: RefObject<HTMLVideoElement | null>
  canvasRef: RefObject<HTMLCanvasElement | null>
  zona: Punto[]
  cerrada: boolean
  umbrales: Umbrales
  modo: ModoConteo
  conteosRespaldo: number[] | undefined
  detectar: (video: HTMLVideoElement) => Promise<DetectedObject[]>
  reproduciendo: boolean
  onCongestionSostenida: (datos: CongestionSostenida) => void
}

const INTERVALO_DETECCION_MS = 200

export function useAnalisis(parametros: Parametros) {
  const { videoRef, canvasRef, modo, reproduciendo, detectar, zona, cerrada } = parametros
  const [serie, setSerie] = useState<MuestraCola[]>([])
  const [segundosCongestion, setSegundosCongestion] = useState(0)

  const ultimos = useRef(parametros)
  const detecciones = useRef<DetectedObject[]>([])
  const serieRef = useRef<MuestraCola[]>([])
  const puntajes = useRef<number[]>([])
  const indiceRespaldo = useRef(0)
  const muestrasCongestion = useRef(0)
  const sugerenciaEmitida = useRef(false)

  useEffect(() => {
    ultimos.current = parametros
  })

  const dibujar = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const video = videoRef.current
    const ancho = video?.videoWidth || 640
    const alto = video?.videoHeight || 360
    if (canvas.width !== ancho || canvas.height !== alto) {
      canvas.width = ancho
      canvas.height = alto
    }
    const { zona: zonaActual, cerrada: zonaCerrada, modo: modoActual } = ultimos.current
    dibujarEscena(ctx, ancho, alto, modoActual === 'vivo' ? detecciones.current : [], zonaActual, zonaCerrada)
  }, [canvasRef, videoRef])

  const reiniciar = useCallback(() => {
    detecciones.current = []
    serieRef.current = []
    puntajes.current = []
    indiceRespaldo.current = 0
    muestrasCongestion.current = 0
    sugerenciaEmitida.current = false
    setSerie([])
    setSegundosCongestion(0)
  }, [])

  // Cada cambio de fuente de conteos arranca una medición nueva.
  useEffect(() => {
    reiniciar()
  }, [modo, reiniciar])

  useEffect(() => {
    dibujar()
  }, [zona, cerrada, modo, dibujar])

  useEffect(() => {
    if (modo !== 'vivo' || !reproduciendo) return
    let activo = true
    let temporizador: ReturnType<typeof setTimeout> | undefined

    const ciclo = async () => {
      const video = videoRef.current
      if (!activo || !video) return
      if (video.readyState >= 2 && !video.paused) {
        try {
          const resultado = await detectar(video)
          if (!activo) return
          detecciones.current = resultado.filter(esVehiculo)
          dibujar()
        } catch {
          detecciones.current = []
        }
      }
      temporizador = setTimeout(ciclo, INTERVALO_DETECCION_MS)
    }
    ciclo()

    return () => {
      activo = false
      clearTimeout(temporizador)
    }
  }, [modo, reproduciendo, detectar, videoRef, dibujar])

  useEffect(() => {
    if (modo === 'cargando' || !reproduciendo) return

    const muestrear = () => {
      const actual = ultimos.current
      const video = videoRef.current
      let conteo = 0

      if (actual.modo === 'vivo') {
        const ancho = video?.videoWidth || 640
        const alto = video?.videoHeight || 360
        const dentro = actual.cerrada
          ? detecciones.current.filter((d) => puntoEnPoligono(puntoDeApoyo(d, ancho, alto), actual.zona))
          : []
        conteo = dentro.length
        if (dentro.length > 0) {
          puntajes.current = [...puntajes.current, dentro.reduce((suma, d) => suma + d.score, 0) / dentro.length].slice(-SEGUNDOS_PARA_SUGERIR)
        }
      } else if (actual.conteosRespaldo?.length) {
        conteo = actual.conteosRespaldo[indiceRespaldo.current % actual.conteosRespaldo.length]
        indiceRespaldo.current += 1
      }

      const conteos = [...serieRef.current.map((m) => m.conteo), conteo]
      const promedio = promedioReciente(conteos)
      serieRef.current = [...serieRef.current, { conteo, promedio }].slice(-SEGUNDOS_GRAFICO)
      setSerie(serieRef.current)

      if (calcularNivel(promedio, actual.umbrales) === 'congestionado') {
        muestrasCongestion.current += 1
        setSegundosCongestion(muestrasCongestion.current)
        if (muestrasCongestion.current >= SEGUNDOS_PARA_SUGERIR && !sugerenciaEmitida.current) {
          sugerenciaEmitida.current = true
          const puntaje = puntajes.current.length ? puntajes.current.reduce((suma, v) => suma + v, 0) / puntajes.current.length : null
          actual.onCongestionSostenida({
            promedio,
            confianza: estimarConfianza(promedio, actual.umbrales, actual.modo === 'vivo' ? puntaje : null),
            segundos: muestrasCongestion.current,
          })
        }
      } else {
        muestrasCongestion.current = 0
        sugerenciaEmitida.current = false
        setSegundosCongestion(0)
      }
    }

    const intervalo = setInterval(muestrear, 1000)
    return () => clearInterval(intervalo)
  }, [modo, reproduciendo, videoRef])

  const ultima = serie[serie.length - 1]
  return {
    serie,
    conteoActual: ultima?.conteo ?? 0,
    promedio: ultima?.promedio ?? 0,
    segundosCongestion,
    dibujar,
    reiniciar,
  }
}
