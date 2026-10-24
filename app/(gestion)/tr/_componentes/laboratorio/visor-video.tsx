'use client'

import { useEffect, useState, type MouseEvent, type RefObject } from 'react'
import { Check, Crop, Info, Pause, PenLine, Play, Trash2, Undo2, X } from 'lucide-react'
import type { Punto } from '@/lib/laboratorio/geometria'
import { CLASE_BOTON, CLASE_BOTON_PRIMARIO } from './estilos'

const RADIO_CIERRE_PX = 14

interface VisorVideoProps {
  videoRef: RefObject<HTMLVideoElement | null>
  canvasRef: RefObject<HTMLCanvasElement | null>
  reproduciendo: boolean
  onReproduccion: (reproduciendo: boolean) => void
  onMetadatos: () => void
  zona: Punto[]
  cerrada: boolean
  dibujando: boolean
  onEmpezar: () => void
  onPunto: (punto: Punto) => void
  onCerrar: () => void
  onDeshacer: () => void
  onBorrar: () => void
  onEjemplo: () => void
}

export function VisorVideo(props: VisorVideoProps) {
  const { videoRef, canvasRef, reproduciendo, onReproduccion, onMetadatos, zona, cerrada, dibujando } = props
  const [falloVideo, setFalloVideo] = useState(false)

  // El video puede empezar a reproducirse antes de que React conecte sus eventos.
  useEffect(() => {
    const video = videoRef.current
    if (video) onReproduccion(!video.paused)
  }, [videoRef, onReproduccion])

  function alternarReproduccion() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play().catch(() => onReproduccion(false))
    else video.pause()
  }

  function alHacerClic(evento: MouseEvent<HTMLCanvasElement>) {
    if (!dibujando) return
    const caja = evento.currentTarget.getBoundingClientRect()
    const punto = { x: (evento.clientX - caja.left) / caja.width, y: (evento.clientY - caja.top) / caja.height }
    const primero = zona[0]
    const cercaDelPrimero =
      primero && zona.length >= 3 && Math.hypot((punto.x - primero.x) * caja.width, (punto.y - primero.y) * caja.height) < RADIO_CIERRE_PX
    if (cercaDelPrimero) props.onCerrar()
    else props.onPunto(punto)
  }

  return (
    <div className="flex flex-col gap-3">
      <p role="note" className="flex items-start gap-2 rounded-md border border-primary bg-secondary p-3 text-sm font-semibold text-primary">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        Video de demostración. No corresponde a cámaras municipales de Rosario.
      </p>

      <div className="relative overflow-hidden rounded-lg border border-border bg-foreground">
        <video
          ref={videoRef}
          src="/demo-transito.mp4"
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-label="Video de demostración de un cruce con tránsito"
          onPlay={() => onReproduccion(true)}
          onPause={() => onReproduccion(false)}
          onLoadedMetadata={onMetadatos}
          onError={() => setFalloVideo(true)}
          className="block aspect-video w-full"
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          onClick={alHacerClic}
          aria-label={
            dibujando
              ? 'Superficie de dibujo. Hacé clic para marcar cada vértice de la zona de cola. Si no podés usar el mouse, elegí la zona de ejemplo.'
              : 'Superficie con las detecciones de vehículos y la zona de cola'
          }
          className={`absolute inset-0 size-full ${dibujando ? 'cursor-crosshair' : 'pointer-events-none'}`}
        />
        {dibujando && (
          <p className="pointer-events-none absolute inset-x-2 bottom-2 rounded bg-foreground/80 px-2 py-1 text-center text-xs font-medium text-background">
            {zona.length < 3
              ? `Hacé clic para marcar los vértices de la zona (${zona.length} de 3 como mínimo).`
              : 'Seguí marcando o cerrá la zona tocando el primer punto.'}
          </p>
        )}
        {falloVideo && (
          <p role="alert" className="absolute inset-0 flex items-center justify-center bg-foreground p-4 text-center text-sm text-background">
            No se pudo cargar el video de demostración.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={alternarReproduccion} className={CLASE_BOTON}>
          {reproduciendo ? <Pause className="size-3.5" aria-hidden="true" /> : <Play className="size-3.5" aria-hidden="true" />}
          {reproduciendo ? 'Pausar video' : 'Reproducir video'}
        </button>

        {dibujando ? (
          <>
            <button type="button" onClick={props.onCerrar} disabled={zona.length < 3} className={CLASE_BOTON_PRIMARIO}>
              <Check className="size-3.5" aria-hidden="true" />
              Cerrar zona
            </button>
            <button type="button" onClick={props.onDeshacer} disabled={zona.length === 0} className={CLASE_BOTON}>
              <Undo2 className="size-3.5" aria-hidden="true" />
              Deshacer punto
            </button>
            <button type="button" onClick={props.onBorrar} className={CLASE_BOTON}>
              <X className="size-3.5" aria-hidden="true" />
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={props.onEmpezar} className={cerrada ? CLASE_BOTON : CLASE_BOTON_PRIMARIO}>
              <PenLine className="size-3.5" aria-hidden="true" />
              {cerrada ? 'Dibujar otra zona' : 'Dibujar zona de cola'}
            </button>
            <button type="button" onClick={props.onEjemplo} className={CLASE_BOTON}>
              <Crop className="size-3.5" aria-hidden="true" />
              Usar zona de ejemplo
            </button>
            {cerrada && (
              <button type="button" onClick={props.onBorrar} className={CLASE_BOTON}>
                <Trash2 className="size-3.5" aria-hidden="true" />
                Borrar zona
              </button>
            )}
          </>
        )}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Video: «MD-355 and MD-124 Gaithersburg», de G. Edward Johnson, en Wikimedia Commons (CC BY 4.0). Reducido a 480p y sin audio para la demostración.
      </p>
    </div>
  )
}
