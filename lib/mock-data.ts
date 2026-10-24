import type { Afectacion, Notificacion, Preferencias, SugerenciaIA, ZonaHabitual } from './types'

export const afectacionesIniciales: Afectacion[] = [
  { id: 'af-001', titulo: 'Obra de mantenimiento vial', descripcion: 'Reducción de calzada por trabajos programados.', tipo: 'obra', estado: 'programada', impacto: 'medio', fuente: 'Secretaría de Obras (simulado)', confiabilidad: 'confirmada', direccion: 'Av. Pellegrini y Bv. Oroño', zona: 'Centro', latitud: -32.9555, longitud: -60.6513, inicio: '2026-10-25T08:00:00-03:00', fin: '2026-10-26T18:00:00-03:00', actualizadaEn: '2026-10-24T09:00:00-03:00', esDatoSimulado: true },
  { id: 'af-002', titulo: 'Evento en Parque Independencia', descripcion: 'Circulación intensa y cortes parciales en accesos.', tipo: 'evento', estado: 'activa', impacto: 'alto', fuente: 'Control de Tránsito (simulado)', confiabilidad: 'estimada', direccion: 'Parque Independencia', zona: 'Parque Independencia', latitud: -32.958, longitud: -60.659, inicio: '2026-10-24T10:00:00-03:00', actualizadaEn: '2026-10-24T12:00:00-03:00', esDatoSimulado: true },
  { id: 'af-003', titulo: 'Corte total por reparación', descripcion: 'Corte temporal por reparación de infraestructura.', tipo: 'corte', estado: 'activa', impacto: 'alto', fuente: 'Secretaría de Obras (simulado)', confiabilidad: 'confirmada', direccion: 'Av. Francia y Córdoba', zona: 'Pichincha', latitud: -32.942, longitud: -60.668, inicio: '2026-10-24T07:30:00-03:00', fin: '2026-10-24T17:00:00-03:00', actualizadaEn: '2026-10-24T11:30:00-03:00', esDatoSimulado: true },
  { id: 'af-004', titulo: 'Congestión vehicular', descripcion: 'Demoras moderadas en el cruce por alto flujo.', tipo: 'congestion', estado: 'activa', impacto: 'medio', fuente: 'Control de Tránsito (simulado)', confiabilidad: 'estimada', direccion: 'Córdoba y Corrientes', zona: 'Centro', latitud: -32.9455, longitud: -60.639, inicio: '2026-10-24T11:00:00-03:00', actualizadaEn: '2026-10-24T12:10:00-03:00', esDatoSimulado: true },
  { id: 'af-005', titulo: 'Actividad en el Monumento', descripcion: 'Evento público con desvíos preventivos.', tipo: 'evento', estado: 'programada', impacto: 'medio', fuente: 'Control de Tránsito (simulado)', confiabilidad: 'confirmada', direccion: 'Monumento a la Bandera', zona: 'Monumento', latitud: -32.9477, longitud: -60.6304, inicio: '2026-10-26T15:00:00-03:00', actualizadaEn: '2026-10-23T16:00:00-03:00', esDatoSimulado: true },
  { id: 'af-006', titulo: 'Poda preventiva', descripcion: 'Intervención de arbolado urbano en la avenida.', tipo: 'poda', estado: 'resuelta', impacto: 'bajo', fuente: 'Secretaría de Obras (simulado)', confiabilidad: 'confirmada', direccion: 'Av. Pellegrini al 1800', zona: 'Abasto', latitud: -32.9601, longitud: -60.6518, inicio: '2026-10-23T08:00:00-03:00', fin: '2026-10-23T13:00:00-03:00', actualizadaEn: '2026-10-23T14:00:00-03:00', esDatoSimulado: true },
  { id: 'af-007', titulo: 'Accidente con demoras', descripcion: 'Demoras preventivas por incidente informado.', tipo: 'accidente', estado: 'resuelta', impacto: 'alto', fuente: 'Control de Tránsito (simulado)', confiabilidad: 'estimada', direccion: 'Bv. Oroño y San Luis', zona: 'Centro', latitud: -32.9505, longitud: -60.6532, inicio: '2026-10-23T18:00:00-03:00', fin: '2026-10-23T20:00:00-03:00', actualizadaEn: '2026-10-23T20:30:00-03:00', esDatoSimulado: true },
  { id: 'af-008', titulo: 'Obra de vereda', descripcion: 'Ocupación parcial de la vereda y carril derecho.', tipo: 'obra', estado: 'activa', impacto: 'bajo', fuente: 'Secretaría de Obras (simulado)', confiabilidad: 'confirmada', direccion: 'Av. Francia al 900', zona: 'Lourdes', latitud: -32.9438, longitud: -60.6602, inicio: '2026-10-24T08:00:00-03:00', actualizadaEn: '2026-10-24T10:15:00-03:00', esDatoSimulado: true },
  { id: 'af-009', titulo: 'Corte de tránsito', descripcion: 'Corte programado por tareas de mantenimiento.', tipo: 'corte', estado: 'cancelada', impacto: 'medio', fuente: 'Secretaría de Obras (simulado)', confiabilidad: 'confirmada', direccion: 'Córdoba y Paraguay', zona: 'Centro', latitud: -32.9471, longitud: -60.6467, inicio: '2026-10-27T09:00:00-03:00', actualizadaEn: '2026-10-24T08:00:00-03:00', esDatoSimulado: true },
  { id: 'af-010', titulo: 'Flujo intenso', descripcion: 'Aumento estimado del tránsito en hora pico.', tipo: 'congestion', estado: 'programada', impacto: 'medio', fuente: 'Control de Tránsito (simulado)', confiabilidad: 'estimada', direccion: 'Av. Pellegrini y Entre Ríos', zona: 'Centro', latitud: -32.9518, longitud: -60.6511, inicio: '2026-10-24T17:00:00-03:00', actualizadaEn: '2026-10-24T09:30:00-03:00', esDatoSimulado: true },
]

export const notificacionesIniciales: Notificacion[] = [
  { id: 'not-001', titulo: 'Nueva afectación cerca tuyo', mensaje: 'Congestión vehicular en Córdoba y Corrientes. Demoras moderadas por alto flujo.', leida: false, creadaEn: '2026-10-24T12:00:00-03:00', afectacionId: 'af-004', tipo: 'congestion', esDatoSimulado: true },
  { id: 'not-002', titulo: 'Corte total en Pichincha', mensaje: 'Corte por reparación en Av. Francia y Córdoba, estimado hasta las 17:00.', leida: false, creadaEn: '2026-10-24T11:35:00-03:00', afectacionId: 'af-003', tipo: 'corte', esDatoSimulado: true },
  { id: 'not-003', titulo: 'Evento en Parque Independencia', mensaje: 'Circulación intensa y cortes parciales en los accesos al parque.', leida: true, creadaEn: '2026-10-24T10:05:00-03:00', afectacionId: 'af-002', tipo: 'evento', esDatoSimulado: true },
  { id: 'not-004', titulo: 'Obra programada para mañana', mensaje: 'Reducción de calzada en Av. Pellegrini y Bv. Oroño desde las 08:00.', leida: true, creadaEn: '2026-10-23T16:30:00-03:00', afectacionId: 'af-001', tipo: 'obra', esDatoSimulado: true },
  { id: 'not-005', titulo: 'Accidente resuelto', mensaje: 'Se normalizó la circulación en Bv. Oroño y San Luis.', leida: true, creadaEn: '2026-10-23T20:35:00-03:00', afectacionId: 'af-007', tipo: 'accidente', esDatoSimulado: true },
  { id: 'not-006', titulo: 'Poda finalizada', mensaje: 'Terminaron los trabajos de arbolado en Av. Pellegrini al 1800.', leida: true, creadaEn: '2026-10-23T13:05:00-03:00', afectacionId: 'af-006', tipo: 'poda', esDatoSimulado: true },
]

// Ubicaciones aproximadas. DATO SIMULADO.
export const zonasPredefinidas: ZonaHabitual[] = [
  { id: 'zona-centro', nombre: 'Centro', latitud: -32.9468, longitud: -60.6393, radioM: 500, origen: 'lista' },
  { id: 'zona-parque-independencia', nombre: 'Parque Independencia', latitud: -32.958, longitud: -60.659, radioM: 500, origen: 'lista' },
  { id: 'zona-pichincha', nombre: 'Pichincha', latitud: -32.942, longitud: -60.668, radioM: 500, origen: 'lista' },
  { id: 'zona-echesortu', nombre: 'Echesortu', latitud: -32.933, longitud: -60.677, radioM: 500, origen: 'lista' },
  { id: 'zona-monumento', nombre: 'Monumento', latitud: -32.9477, longitud: -60.6304, radioM: 500, origen: 'lista' },
  { id: 'zona-abasto', nombre: 'Abasto', latitud: -32.9601, longitud: -60.6518, radioM: 500, origen: 'lista' },
  { id: 'zona-lourdes', nombre: 'Lourdes', latitud: -32.9438, longitud: -60.6602, radioM: 500, origen: 'lista' },
]

export const preferenciasIniciales: Preferencias = {
  recibirNotificaciones: true,
  tiposSeguidos: ['obra', 'corte', 'congestion', 'evento'],
  zonasHabituales: [zonasPredefinidas[0]],
  modosAviso: { appAbierta: true, zonasHabituales: false, alAcercarme: false },
  radioAnticipacionM: 1000,
  soloAltoImpacto: false,
}
export const sugerenciasIniciales: SugerenciaIA[] = [{ id: 'sug-001', afectacionId: 'af-004', texto: 'Considerar una comunicación preventiva para quienes circulen por el Centro.', estado: 'pendiente', creadaEn: '2026-10-24T12:00:00-03:00', esDatoSimulado: true }]
