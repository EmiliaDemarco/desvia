export interface PartesDireccion {
  calle: string
  altura: string
  interseccion: string
}

export function componerDireccion({ calle, altura, interseccion }: PartesDireccion): string {
  const base = calle.trim()
  const conAltura = altura.trim() ? `${base} al ${altura.trim()}` : base
  return interseccion.trim() ? `${conAltura} y ${interseccion.trim()}` : conAltura
}

// Para las afectaciones que solo tienen la dirección como texto libre.
export function descomponerDireccion(direccion: string): PartesDireccion {
  const conAltura = direccion.match(/^(.+?) al (\d+)$/)
  if (conAltura) return { calle: conAltura[1], altura: conAltura[2], interseccion: '' }
  const cruce = direccion.match(/^(.+?) y (.+)$/)
  if (cruce) return { calle: cruce[1], altura: '', interseccion: cruce[2] }
  return { calle: direccion, altura: '', interseccion: '' }
}
