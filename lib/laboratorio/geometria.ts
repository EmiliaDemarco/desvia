/** Punto normalizado: x e y entre 0 y 1 respecto del ancho y alto del video. */
export interface Punto {
  x: number
  y: number
}

// Zona de ejemplo sobre la calzada principal del video de demostración.
export const ZONA_EJEMPLO: Punto[] = [
  { x: 0.04, y: 0.46 },
  { x: 0.72, y: 0.46 },
  { x: 0.82, y: 0.64 },
  { x: 0.1, y: 0.64 },
]

// Algoritmo del rayo: cuenta cuántos lados del polígono cruza una semirrecta horizontal desde el punto.
export function puntoEnPoligono(punto: Punto, poligono: Punto[]): boolean {
  if (poligono.length < 3) return false
  let dentro = false
  for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
    const a = poligono[i]
    const b = poligono[j]
    const cruza = a.y > punto.y !== b.y > punto.y && punto.x < ((b.x - a.x) * (punto.y - a.y)) / (b.y - a.y) + a.x
    if (cruza) dentro = !dentro
  }
  return dentro
}
