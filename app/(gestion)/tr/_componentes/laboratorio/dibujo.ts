import type { DetectedObject } from '@tensorflow-models/coco-ssd'
import { puntoEnPoligono, type Punto } from '@/lib/laboratorio/geometria'
import { CLASES_VEHICULO, NOMBRE_CLASE } from '@/lib/laboratorio/nivel'

// El canvas pinta sobre el video, así que no puede usar los tokens de color del tema.
const NARANJA = '#F26B1D'
const BLANCO = '#FFFFFF'
const OSCURO = '#0F1B33'

export function esVehiculo(deteccion: DetectedObject): boolean {
  return (CLASES_VEHICULO as readonly string[]).includes(deteccion.class)
}

// Se usa la parte baja de la caja, que es donde el vehículo apoya sobre la calzada.
export function puntoDeApoyo(deteccion: DetectedObject, ancho: number, alto: number): Punto {
  const [x, y, w, h] = deteccion.bbox
  return { x: (x + w / 2) / ancho, y: (y + h * 0.85) / alto }
}

export function dibujarEscena(
  ctx: CanvasRenderingContext2D,
  ancho: number,
  alto: number,
  detecciones: DetectedObject[],
  zona: Punto[],
  cerrada: boolean,
) {
  const escala = ancho / 640
  ctx.clearRect(0, 0, ancho, alto)

  if (zona.length > 0) {
    ctx.beginPath()
    zona.forEach((punto, indice) => {
      const x = punto.x * ancho
      const y = punto.y * alto
      if (indice === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    if (cerrada) {
      ctx.closePath()
      ctx.fillStyle = 'rgba(242, 107, 29, 0.2)'
      ctx.fill()
    }
    ctx.lineWidth = 3 * escala
    ctx.strokeStyle = NARANJA
    ctx.setLineDash(cerrada ? [] : [8 * escala, 6 * escala])
    ctx.stroke()
    ctx.setLineDash([])

    zona.forEach((punto, indice) => {
      ctx.beginPath()
      ctx.arc(punto.x * ancho, punto.y * alto, (indice === 0 && !cerrada ? 7 : 4.5) * escala, 0, Math.PI * 2)
      ctx.fillStyle = indice === 0 && !cerrada ? BLANCO : NARANJA
      ctx.fill()
      ctx.lineWidth = 2 * escala
      ctx.strokeStyle = NARANJA
      ctx.stroke()
    })
  }

  ctx.font = `${12 * escala}px sans-serif`
  ctx.textBaseline = 'top'
  detecciones.forEach((deteccion) => {
    const [x, y, w, h] = deteccion.bbox
    const dentro = cerrada && puntoEnPoligono(puntoDeApoyo(deteccion, ancho, alto), zona)
    ctx.lineWidth = (dentro ? 3 : 1.5) * escala
    ctx.strokeStyle = dentro ? NARANJA : BLANCO
    ctx.strokeRect(x, y, w, h)

    const etiqueta = `${NOMBRE_CLASE[deteccion.class] ?? deteccion.class} ${Math.round(deteccion.score * 100)}%`
    const anchoEtiqueta = ctx.measureText(etiqueta).width + 8 * escala
    const altoEtiqueta = 16 * escala
    const yEtiqueta = Math.max(0, y - altoEtiqueta)
    ctx.fillStyle = dentro ? NARANJA : OSCURO
    ctx.fillRect(x, yEtiqueta, anchoEtiqueta, altoEtiqueta)
    ctx.fillStyle = dentro ? OSCURO : BLANCO
    ctx.fillText(etiqueta, x + 4 * escala, yEtiqueta + 2 * escala)
  })
}
