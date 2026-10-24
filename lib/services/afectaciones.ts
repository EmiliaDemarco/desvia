// Reemplazar por API real de la Municipalidad cuando esté autorizada.
import { AHORA_SIMULADO } from '../alerts/simulacion'
import { desdeValorInputFechaHora } from '../formato'
import { componerDireccion } from '../gestion/direccion'
import { coordenadaValida, validarFormulario, type ErroresFormulario, type ValoresFormulario } from '../gestion/formulario'
import { registrosDeCambio, registrosDeCreacion } from '../gestion/historial'
import { zonaMasCercana } from '../gestion/zona'
import { useDemoStore } from '../store'
import type { Afectacion, Estado } from '../types'

export type ResultadoGuardado = { ok: true; afectacion: Afectacion } | { ok: false; errores: ErroresFormulario }

const MENSAJE_SIN_DIRECCION = 'Ubicación marcada en el mapa'

const nombreDelOperador = () => useDemoStore.getState().usuarioActual?.nombre ?? 'Sin sesión'

// El estado operativo se deduce del inicio; resuelta y cancelada solo cambian por una acción explícita.
function estadoOperativo(previo: Estado | undefined, inicio: string): Estado {
  if (previo === 'resuelta' || previo === 'cancelada') return previo
  return Date.parse(inicio) <= AHORA_SIMULADO.getTime() ? 'activa' : 'programada'
}

function siguienteId(existentes: Afectacion[]): string {
  const mayor = existentes.reduce((max, { id }) => Math.max(max, Number(id.replace(/\D/g, '')) || 0), 0)
  return `af-${String(mayor + 1).padStart(3, '0')}`
}

function desdeValores(valores: ValoresFormulario, base: Pick<Afectacion, 'id' | 'confiabilidad'> & { estado?: Estado }, ahora: string): Afectacion {
  const latitud = coordenadaValida(valores.latitud, 90) as number
  const longitud = coordenadaValida(valores.longitud, 180) as number
  const inicio = desdeValorInputFechaHora(valores.inicio)
  const direccion = componerDireccion(valores) || MENSAJE_SIN_DIRECCION
  return {
    id: base.id,
    titulo: valores.titulo.trim(),
    descripcion: valores.descripcion.trim(),
    tipo: valores.tipo as Afectacion['tipo'],
    estado: estadoOperativo(base.estado, inicio),
    publicacion: valores.publicacion,
    impacto: valores.impacto,
    fuente: valores.fuente.trim(),
    confiabilidad: base.confiabilidad,
    direccion,
    calle: valores.calle.trim(),
    altura: valores.altura.trim(),
    interseccion: valores.interseccion.trim(),
    zona: zonaMasCercana(latitud, longitud),
    latitud,
    longitud,
    inicio,
    fin: valores.fin ? desdeValorInputFechaHora(valores.fin) : undefined,
    tipoCorte: valores.tipoCorte,
    sentidoAfectado: valores.sentidoAfectado.trim(),
    observacionesInternas: valores.observacionesInternas.trim(),
    actualizadaEn: ahora,
    esDatoSimulado: true,
  }
}

export async function listarAfectaciones(): Promise<Afectacion[]> {
  return useDemoStore.getState().afectaciones
}

export async function crearAfectacion(valores: ValoresFormulario): Promise<ResultadoGuardado> {
  const errores = validarFormulario(valores)
  if (Object.keys(errores).length > 0) return { ok: false, errores }

  const { afectaciones, registrarCambioAfectaciones } = useDemoStore.getState()
  const ahora = new Date().toISOString()
  const nueva = desdeValores(valores, { id: siguienteId(afectaciones), confiabilidad: 'estimada' }, ahora)
  registrarCambioAfectaciones([...afectaciones, nueva], registrosDeCreacion(nueva, nombreDelOperador(), ahora))
  return { ok: true, afectacion: nueva }
}

export async function editarAfectacion(id: string, valores: ValoresFormulario): Promise<ResultadoGuardado> {
  const errores = validarFormulario(valores)
  if (Object.keys(errores).length > 0) return { ok: false, errores }

  const actual = useDemoStore.getState().afectaciones.find((a) => a.id === id)
  if (!actual) return { ok: false, errores: { titulo: 'La afectación ya no existe.' } }
  const resultado = aplicarCambio(id, (previa, ahora) => desdeValores(valores, previa, ahora))
  return { ok: true, afectacion: resultado ?? actual }
}

// Si nada cambió no se toca la afectación ni se registra historial.
function aplicarCambio(id: string, transformar: (actual: Afectacion, ahora: string) => Afectacion): Afectacion | undefined {
  const { afectaciones, registrarCambioAfectaciones } = useDemoStore.getState()
  const actual = afectaciones.find((a) => a.id === id)
  if (!actual) return undefined

  const ahora = new Date().toISOString()
  const siguiente = transformar(actual, ahora)
  const cambios = registrosDeCambio(actual, siguiente, nombreDelOperador(), ahora)
  if (cambios.length === 0) return actual

  registrarCambioAfectaciones(afectaciones.map((a) => (a.id === id ? { ...siguiente, actualizadaEn: ahora } : a)), cambios)
  return { ...siguiente, actualizadaEn: ahora }
}

export async function publicarAfectacion(id: string): Promise<Afectacion | undefined> {
  return aplicarCambio(id, (a) => ({ ...a, publicacion: 'publicada' }))
}

export async function resolverAfectacion(id: string): Promise<Afectacion | undefined> {
  return aplicarCambio(id, (a) => ({ ...a, estado: 'resuelta' }))
}

export async function cancelarAfectacion(id: string): Promise<Afectacion | undefined> {
  return aplicarCambio(id, (a) => ({ ...a, estado: 'cancelada' }))
}
