import { formatearFechaHora, NOMBRE_CORTE, NOMBRE_ESTADO, NOMBRE_IMPACTO, NOMBRE_PUBLICACION, NOMBRE_TIPO } from '../formato'
import type { Afectacion, CambioHistorial } from '../types'

const VACIO = '—'
const texto = (valor?: string) => valor?.trim() || VACIO

interface CampoAuditado {
  etiqueta: string
  accion: string
  leer: (afectacion: Afectacion) => string
}

const CAMPOS: CampoAuditado[] = [
  { etiqueta: 'Título', accion: 'Edición', leer: (a) => texto(a.titulo) },
  { etiqueta: 'Tipo', accion: 'Edición', leer: (a) => NOMBRE_TIPO[a.tipo] },
  { etiqueta: 'Descripción pública', accion: 'Edición', leer: (a) => texto(a.descripcion) },
  { etiqueta: 'Calle', accion: 'Edición', leer: (a) => texto(a.calle) },
  { etiqueta: 'Altura', accion: 'Edición', leer: (a) => texto(a.altura) },
  { etiqueta: 'Intersección', accion: 'Edición', leer: (a) => texto(a.interseccion) },
  { etiqueta: 'Ubicación', accion: 'Edición', leer: (a) => `${a.latitud.toFixed(5)}, ${a.longitud.toFixed(5)}` },
  { etiqueta: 'Inicio', accion: 'Edición', leer: (a) => formatearFechaHora(a.inicio) },
  { etiqueta: 'Fin estimado', accion: 'Edición', leer: (a) => (a.fin ? formatearFechaHora(a.fin) : VACIO) },
  { etiqueta: 'Tipo de corte', accion: 'Edición', leer: (a) => (a.tipoCorte ? NOMBRE_CORTE[a.tipoCorte] : VACIO) },
  { etiqueta: 'Sentido afectado', accion: 'Edición', leer: (a) => texto(a.sentidoAfectado) },
  { etiqueta: 'Impacto', accion: 'Edición', leer: (a) => NOMBRE_IMPACTO[a.impacto] },
  { etiqueta: 'Observaciones internas', accion: 'Edición', leer: (a) => texto(a.observacionesInternas) },
  { etiqueta: 'Fuente', accion: 'Edición', leer: (a) => texto(a.fuente) },
  { etiqueta: 'Publicación', accion: 'Cambio de publicación', leer: (a) => NOMBRE_PUBLICACION[a.publicacion] },
  { etiqueta: 'Estado', accion: 'Cambio de estado', leer: (a) => NOMBRE_ESTADO[a.estado] },
]

let contador = 0
const nuevoId = () => `his-${Date.now().toString(36)}-${(contador++).toString(36)}`

function registro(afectacion: Afectacion, usuario: string, fecha: string, accion: string, campo: string, anterior: string, nuevo: string): CambioHistorial {
  return {
    id: nuevoId(),
    entidad: 'afectacion',
    entidadId: afectacion.id,
    accion,
    fecha,
    usuario,
    campo,
    valorAnterior: anterior,
    valorNuevo: nuevo,
    detalle: `${campo}: ${anterior} → ${nuevo}`,
    esDatoSimulado: true,
  }
}

export function registrosDeCreacion(afectacion: Afectacion, usuario: string, fecha: string): CambioHistorial[] {
  const registros = [registro(afectacion, usuario, fecha, 'Creación', 'Afectación', VACIO, afectacion.titulo)]
  if (afectacion.publicacion !== 'borrador') {
    registros.push(registro(afectacion, usuario, fecha, 'Cambio de publicación', 'Publicación', VACIO, NOMBRE_PUBLICACION[afectacion.publicacion]))
  }
  return registros
}

export function registrosDeCambio(antes: Afectacion, despues: Afectacion, usuario: string, fecha: string): CambioHistorial[] {
  return CAMPOS.flatMap(({ etiqueta, accion, leer }) => {
    const anterior = leer(antes)
    const nuevo = leer(despues)
    return anterior === nuevo ? [] : [registro(despues, usuario, fecha, accion, etiqueta, anterior, nuevo)]
  })
}
