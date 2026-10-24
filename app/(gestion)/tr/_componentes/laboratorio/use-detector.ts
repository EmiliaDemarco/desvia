'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { DetectedObject, ObjectDetection } from '@tensorflow-models/coco-ssd'
import { SEGUNDOS_ESPERA_MODELO } from '@/lib/laboratorio/nivel'

export type EstadoModelo = 'cargando' | 'listo' | 'respaldo'

// TensorFlow.js y coco-ssd pesan varios MB: se descargan solo al entrar al laboratorio y nunca en el servidor.
async function cargarModelo(): Promise<ObjectDetection> {
  const tf = await import('@tensorflow/tfjs')
  const cocoSsd = await import('@tensorflow-models/coco-ssd')
  await tf.ready()
  return cocoSsd.load({ base: 'lite_mobilenet_v2' })
}

export function useDetector() {
  const [estado, setEstado] = useState<EstadoModelo>('cargando')
  const [intento, setIntento] = useState(0)
  const modeloRef = useRef<ObjectDetection | null>(null)

  useEffect(() => {
    let vigente = true
    let temporizador: ReturnType<typeof setTimeout> | undefined
    const limite = new Promise<never>((_, rechazar) => {
      temporizador = setTimeout(() => rechazar(new Error('El modelo tardó demasiado en cargar')), SEGUNDOS_ESPERA_MODELO * 1000)
    })

    Promise.race([cargarModelo(), limite])
      .then((modelo) => {
        if (!vigente) return
        modeloRef.current = modelo
        setEstado('listo')
      })
      .catch(() => {
        if (vigente) setEstado('respaldo')
      })
      .finally(() => clearTimeout(temporizador))

    return () => {
      vigente = false
      clearTimeout(temporizador)
    }
  }, [intento])

  const detectar = useCallback(async (video: HTMLVideoElement): Promise<DetectedObject[]> => {
    const modelo = modeloRef.current
    return modelo ? modelo.detect(video, 30, 0.35) : []
  }, [])

  const reintentar = useCallback(() => {
    setEstado('cargando')
    setIntento((valor) => valor + 1)
  }, [])

  return { estado, detectar, reintentar }
}
