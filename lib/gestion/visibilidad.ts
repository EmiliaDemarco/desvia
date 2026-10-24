import type { Afectacion, AfectacionCiudadana } from '../types'

// Borrador: no se ve. Programada: se publica sola al llegar el inicio. Publicada: se ve de inmediato.
export function esVisibleParaCiudadano(afectacion: Afectacion, ahora: Date): boolean {
  if (afectacion.publicacion === 'publicada') return true
  if (afectacion.publicacion === 'programada') return Date.parse(afectacion.inicio) <= ahora.getTime()
  return false
}

export function paraCiudadano(afectacion: Afectacion): AfectacionCiudadana {
  const { observacionesInternas: _internas, ...publica } = afectacion
  return publica
}

// Único punto de entrada de la experiencia ciudadana: filtra lo no publicado y quita los campos internos.
export function afectacionesParaCiudadano(afectaciones: Afectacion[], ahora: Date): AfectacionCiudadana[] {
  return afectaciones.filter((a) => esVisibleParaCiudadano(a, ahora)).map(paraCiudadano)
}
