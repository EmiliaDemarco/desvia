// Reemplazar por API real de la Municipalidad cuando esté autorizada.
import { AHORA_SIMULADO } from '../alerts/simulacion'
import { aValorInputFechaHora } from '../formato'
import { descomponerDireccion } from '../gestion/direccion'
import { valoresVacios, type ValoresFormulario } from '../gestion/formulario'
import { registroDeSugerencia } from '../gestion/historial'
import { useDemoStore } from '../store'
import type { SugerenciaIA } from '../types'
import { crearAfectacion } from './afectaciones'

export const FUENTE_CAMARA_DEMO = 'Análisis de cámara (demo)'
const USUARIO_ANALISIS = 'Análisis de cámara (demo)'

const nombreDelOperador = () => useDemoStore.getState().usuarioActual?.nombre ?? 'Sin sesión'

export interface DatosSugerenciaCamara {
  latitud: number
  longitud: number
  direccion: string
  promedio: number
  confianza: number
  segundosSostenidos: number
}

export type ResultadoSugerencia = { ok: true; mensaje: string } | { ok: false; mensaje: string }

export function crearSugerenciaDeCamara(datos: DatosSugerenciaCamara): SugerenciaIA | null {
  const { sugerencias, setSugerencias, historial, setHistorial } = useDemoStore.getState()
  if (sugerencias.some((s) => s.origen === FUENTE_CAMARA_DEMO && s.estado === 'pendiente')) return null

  const ahora = new Date().toISOString()
  const promedio = datos.promedio.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const nueva: SugerenciaIA = {
    id: `sug-${Date.now().toString(36)}`,
    origen: FUENTE_CAMARA_DEMO,
    titulo: `Congestión estimada en ${datos.direccion}`,
    tipo: 'congestion',
    direccion: datos.direccion,
    latitud: datos.latitud,
    longitud: datos.longitud,
    confianza: datos.confianza,
    texto: `La cámara de demostración registró un promedio de ${promedio} vehículos en la zona de cola durante el último minuto, con nivel congestionado sostenido por ${datos.segundosSostenidos} s.`,
    estado: 'pendiente',
    creadaEn: ahora,
    esDatoSimulado: true,
  }
  setSugerencias([nueva, ...sugerencias])
  setHistorial([...historial, registroDeSugerencia(nueva.id, USUARIO_ANALISIS, ahora, 'Creación', 'Sugerencia IA', '—', nueva.titulo ?? '')])
  return nueva
}

export async function aprobarYPublicarSugerencia(id: string): Promise<ResultadoSugerencia> {
  const sugerencia = useDemoStore.getState().sugerencias.find((s) => s.id === id)
  if (!sugerencia || sugerencia.estado !== 'pendiente') return { ok: false, mensaje: 'La sugerencia ya fue resuelta.' }
  if (sugerencia.latitud === undefined || sugerencia.longitud === undefined || !sugerencia.tipo) {
    return { ok: false, mensaje: 'La sugerencia no tiene ubicación para crear una afectación.' }
  }

  const operador = nombreDelOperador()
  const partes = descomponerDireccion(sugerencia.direccion ?? '')
  const confianza = Math.round((sugerencia.confianza ?? 0) * 100)
  const valores: ValoresFormulario = {
    ...valoresVacios,
    titulo: sugerencia.titulo ?? 'Congestión estimada',
    tipo: sugerencia.tipo,
    descripcion:
      'Se estima congestión vehicular en la zona. Dato estimado a partir de conteos agregados de una cámara de demostración, sin imágenes ni patentes.',
    calle: partes.calle,
    altura: partes.altura,
    interseccion: partes.interseccion,
    latitud: String(sugerencia.latitud),
    longitud: String(sugerencia.longitud),
    inicio: aValorInputFechaHora(AHORA_SIMULADO.toISOString()),
    tipoCorte: 'parcial',
    impacto: 'medio',
    observacionesInternas: `Generada por IA con confianza estimada del ${confianza} %. Aprobada por ${operador}.`,
    fuente: FUENTE_CAMARA_DEMO,
    publicacion: 'publicada',
  }

  const resultado = await crearAfectacion(valores)
  if (!resultado.ok) return { ok: false, mensaje: 'No se pudo crear la afectación a partir de la sugerencia.' }

  const { sugerencias, setSugerencias, historial, setHistorial } = useDemoStore.getState()
  const ahora = new Date().toISOString()
  setSugerencias(sugerencias.map((s) => (s.id === id ? { ...s, estado: 'aceptada', afectacionCreadaId: resultado.afectacion.id } : s)))
  setHistorial([
    ...historial,
    registroDeSugerencia(id, operador, ahora, 'Aprobación', 'Estado', 'Pendiente', `Aprobada y publicada como ${resultado.afectacion.id}`),
  ])
  return { ok: true, mensaje: `Se publicó «${resultado.afectacion.titulo}» con fuente «${FUENTE_CAMARA_DEMO}» y confiabilidad estimada.` }
}

function cerrarSugerencia(id: string, estado: 'aceptada' | 'descartada'): ResultadoSugerencia {
  const { sugerencias, setSugerencias, historial, setHistorial } = useDemoStore.getState()
  const sugerencia = sugerencias.find((s) => s.id === id)
  if (!sugerencia || sugerencia.estado !== 'pendiente') return { ok: false, mensaje: 'La sugerencia ya fue resuelta.' }

  const ahora = new Date().toISOString()
  const accion = estado === 'descartada' ? 'Descarte' : 'Aceptación'
  setSugerencias(sugerencias.map((s) => (s.id === id ? { ...s, estado } : s)))
  setHistorial([...historial, registroDeSugerencia(id, nombreDelOperador(), ahora, accion, 'Estado', 'Pendiente', estado === 'descartada' ? 'Descartada' : 'Aceptada')])
  return { ok: true, mensaje: estado === 'descartada' ? 'Sugerencia descartada.' : 'Sugerencia aceptada.' }
}

export const descartarSugerencia = (id: string) => cerrarSugerencia(id, 'descartada')
export const aceptarSugerencia = (id: string) => cerrarSugerencia(id, 'aceptada')
