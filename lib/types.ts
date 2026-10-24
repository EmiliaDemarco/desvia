export type TipoAfectacion = 'obra' | 'corte' | 'poda' | 'accidente' | 'congestion' | 'evento'
export type Estado = 'programada' | 'activa' | 'resuelta' | 'cancelada'
export type Impacto = 'bajo' | 'medio' | 'alto'
export type Confiabilidad = 'confirmada' | 'estimada'
export type Publicacion = 'borrador' | 'programada' | 'publicada'
export type TipoCorte = 'parcial' | 'total'

export interface Afectacion {
  id: string
  titulo: string
  descripcion: string
  tipo: TipoAfectacion
  estado: Estado
  publicacion: Publicacion
  impacto: Impacto
  fuente: string
  confiabilidad: Confiabilidad
  direccion: string
  calle?: string
  altura?: string
  interseccion?: string
  zona: string
  latitud: number
  longitud: number
  inicio: string
  fin?: string
  tipoCorte?: TipoCorte
  sentidoAfectado?: string
  /** Solo para el panel de gestión. Nunca se muestra en la experiencia ciudadana. */
  observacionesInternas?: string
  actualizadaEn: string
  esDatoSimulado: true
}

/** Lo que ve la ciudadanía: la afectación sin ningún campo interno. */
export type AfectacionCiudadana = Omit<Afectacion, 'observacionesInternas'>

export interface Notificacion {
  id: string
  titulo: string
  mensaje: string
  leida: boolean
  creadaEn: string
  afectacionId?: string
  tipo: TipoAfectacion
  esDatoSimulado: true
}

export interface ZonaHabitual {
  id: string
  nombre: string
  latitud: number
  longitud: number
  radioM: number
  origen: 'lista' | 'mapa'
}

export interface ModosAviso {
  appAbierta: boolean
  zonasHabituales: boolean
  alAcercarme: boolean
}

export interface Preferencias {
  recibirNotificaciones: boolean
  tiposSeguidos: TipoAfectacion[]
  zonasHabituales: ZonaHabitual[]
  modosAviso: ModosAviso
  radioAnticipacionM?: number
  soloAltoImpacto?: boolean
}

export interface CambioHistorial {
  id: string
  entidad: 'afectacion' | 'notificacion' | 'preferencias' | 'sugerencia'
  entidadId: string
  accion: string
  fecha: string
  usuario: string
  campo?: string
  valorAnterior?: string
  valorNuevo?: string
  detalle: string
  esDatoSimulado: true
}

export interface UsuarioDemo {
  id: string
  nombre: string
  rol: string
  esDatoSimulado: true
}

export interface SugerenciaIA {
  id: string
  afectacionId?: string
  /** Sugerencias generadas por el análisis de cámara: proponen crear una afectación. */
  origen?: string
  titulo?: string
  tipo?: TipoAfectacion
  direccion?: string
  latitud?: number
  longitud?: number
  /** Confianza estimada entre 0 y 1. */
  confianza?: number
  afectacionCreadaId?: string
  texto: string
  estado: 'pendiente' | 'aceptada' | 'descartada'
  creadaEn: string
  esDatoSimulado: true
}
