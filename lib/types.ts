export type TipoAfectacion = 'obra' | 'corte' | 'poda' | 'accidente' | 'congestion' | 'evento'
export type Estado = 'programada' | 'activa' | 'resuelta' | 'cancelada'
export type Impacto = 'bajo' | 'medio' | 'alto'
export type Confiabilidad = 'confirmada' | 'estimada'

export interface Afectacion {
  id: string
  titulo: string
  descripcion: string
  tipo: TipoAfectacion
  estado: Estado
  impacto: Impacto
  fuente: string
  confiabilidad: Confiabilidad
  direccion: string
  zona: string
  latitud: number
  longitud: number
  inicio: string
  fin?: string
  actualizadaEn: string
  esDatoSimulado: true
}

export interface Notificacion {
  id: string
  titulo: string
  mensaje: string
  leida: boolean
  creadaEn: string
  afectacionId?: string
  esDatoSimulado: true
}

export interface Preferencias {
  recibirNotificaciones: boolean
  tiposSeguidos: TipoAfectacion[]
  zonasSeguidas: string[]
}

export interface CambioHistorial {
  id: string
  entidad: 'afectacion' | 'notificacion' | 'preferencias'
  entidadId: string
  accion: string
  fecha: string
  detalle: string
  esDatoSimulado: true
}

export interface SugerenciaIA {
  id: string
  afectacionId?: string
  texto: string
  estado: 'pendiente' | 'aceptada' | 'descartada'
  creadaEn: string
  esDatoSimulado: true
}
