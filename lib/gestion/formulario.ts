import { aValorInputFechaHora, desdeValorInputFechaHora } from '../formato'
import type { Afectacion, Impacto, Publicacion, TipoAfectacion, TipoCorte } from '../types'

export const FUENTE_POR_DEFECTO = 'Gestión desvIA TR (simulado)'

export interface ValoresFormulario {
  titulo: string
  tipo: TipoAfectacion | ''
  descripcion: string
  calle: string
  altura: string
  interseccion: string
  latitud: string
  longitud: string
  inicio: string
  fin: string
  tipoCorte: TipoCorte
  sentidoAfectado: string
  impacto: Impacto
  observacionesInternas: string
  fuente: string
  publicacion: Publicacion
}

export type CampoConError = 'titulo' | 'tipo' | 'ubicacion' | 'inicio' | 'fin'
export type ErroresFormulario = Partial<Record<CampoConError, string>>

export const valoresVacios: ValoresFormulario = {
  titulo: '',
  tipo: '',
  descripcion: '',
  calle: '',
  altura: '',
  interseccion: '',
  latitud: '',
  longitud: '',
  inicio: '',
  fin: '',
  tipoCorte: 'parcial',
  sentidoAfectado: '',
  impacto: 'medio',
  observacionesInternas: '',
  fuente: FUENTE_POR_DEFECTO,
  publicacion: 'borrador',
}

export function valoresDesdeAfectacion(a: Afectacion): ValoresFormulario {
  return {
    titulo: a.titulo,
    tipo: a.tipo,
    descripcion: a.descripcion,
    calle: a.calle ?? '',
    altura: a.altura ?? '',
    interseccion: a.interseccion ?? '',
    latitud: String(a.latitud),
    longitud: String(a.longitud),
    inicio: aValorInputFechaHora(a.inicio),
    fin: aValorInputFechaHora(a.fin),
    tipoCorte: a.tipoCorte ?? 'parcial',
    sentidoAfectado: a.sentidoAfectado ?? '',
    impacto: a.impacto,
    observacionesInternas: a.observacionesInternas ?? '',
    fuente: a.fuente,
    publicacion: a.publicacion,
  }
}

export function coordenadaValida(valor: string, maximo: number): number | null {
  if (!valor.trim()) return null
  const numero = Number(valor)
  return Number.isFinite(numero) && Math.abs(numero) <= maximo ? numero : null
}

export function validarFormulario(v: ValoresFormulario): ErroresFormulario {
  const errores: ErroresFormulario = {}
  if (!v.titulo.trim()) errores.titulo = 'Ingresá un título.'
  if (!v.tipo) errores.tipo = 'Elegí el tipo de afectación.'
  if (coordenadaValida(v.latitud, 90) === null || coordenadaValida(v.longitud, 180) === null) {
    errores.ubicacion = 'Marcá la ubicación en el mapa o ingresá latitud y longitud válidas.'
  }
  if (!v.inicio) errores.inicio = 'Indicá la fecha y hora de inicio.'
  if (v.fin) {
    if (!v.inicio) errores.fin = 'Indicá primero el inicio.'
    else if (Date.parse(desdeValorInputFechaHora(v.fin)) <= Date.parse(desdeValorInputFechaHora(v.inicio))) {
      errores.fin = 'El fin estimado debe ser posterior al inicio.'
    }
  }
  return errores
}
