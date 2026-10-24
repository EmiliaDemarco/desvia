'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Check, MapPin, Pencil, Trash2, X } from 'lucide-react'
import { preferenciasIniciales, zonasPredefinidas } from '@/lib/mock-data'
import { ETIQUETA_TIPO, TIPOS_AFECTACION } from '@/lib/formato'
import { actualizarPreferencias } from '@/lib/services/preferencias'
import { useDemoStore } from '@/lib/store'
import type { ModosAviso, Preferencias, TipoAfectacion, ZonaHabitual } from '@/lib/types'
import { useHidratado } from '@/lib/use-hidratado'
import { Interruptor } from '../interruptor'
import { SubEncabezado } from '../sub-encabezado'

const MapaZonas = dynamic(() => import('./mapa-zonas'), { ssr: false, loading: () => <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-500">Cargando mapa simulado…</div> })

const MAX_ZONAS = 3
const RADIO_ZONA_M = 500
const MAX_LARGO_NOMBRE = 30

const descripcionTipo: Record<TipoAfectacion, string> = {
  obra: 'Obras y trabajos en la vía pública',
  corte: 'Cortes de tránsito',
  poda: 'Podas y arbolado',
  accidente: 'Accidentes viales',
  congestion: 'Congestión vehicular',
  evento: 'Eventos y actividades públicas',
}

const modos: Array<{ clave: keyof ModosAviso; titulo: string; descripcion: string; requisito?: string; enDemo: string }> = [
  {
    clave: 'appAbierta',
    titulo: 'Con la app abierta',
    descripcion: 'Te avisamos usando tu ubicación mientras usás la app.',
    enDemo: 'Avisa cuando la posición simulada de Juan entra en tu distancia de anticipación.',
  },
  {
    clave: 'zonasHabituales',
    titulo: 'Por zonas habituales',
    descripcion: 'Recibís avisos aunque la app esté cerrada, sin compartir tu ubicación. Solo te avisamos de las zonas que elegiste.',
    requisito: 'Requiere integración con las notificaciones de TR-Móvil',
    enDemo: 'Avisa de las afectaciones dentro de tus zonas habituales, sin usar la posición.',
  },
  {
    clave: 'alAcercarme',
    titulo: 'Al acercarme a una afectación',
    descripcion: 'Usa tu ubicación en segundo plano para avisarte cuando te acercás a una afectación. Es opcional.',
    requisito: "Propuesta. Requiere permiso de ubicación 'siempre' e integración con TR-Móvil",
    enDemo: 'Avisa al acercarte a una afectación, usando la posición simulada de Juan.',
  },
]

export default function PreferenciasPage() {
  const hidratado = useHidratado()
  const preferencias = useDemoStore((estado) => estado.preferencias)
  const [punto, setPunto] = useState<[number, number] | null>(null)
  const [aviso, setAviso] = useState('')
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [nombreEditado, setNombreEditado] = useState('')

  const cambiar = (cambios: Partial<Preferencias>) => void actualizarPreferencias(cambios)
  const zonas = preferencias.zonasHabituales
  const llena = zonas.length >= MAX_ZONAS
  const radio = preferencias.radioAnticipacionM ?? 1000

  const alternarTipo = (tipo: TipoAfectacion, activo: boolean) =>
    cambiar({ tiposSeguidos: TIPOS_AFECTACION.filter((t) => (t === tipo ? activo : preferencias.tiposSeguidos.includes(t))) })

  const agregarZona = (zona: ZonaHabitual) => {
    if (zonas.length >= MAX_ZONAS) return setAviso(`Podés tener hasta ${MAX_ZONAS} zonas habituales. Quitá una para agregar otra.`)
    if (zonas.some((z) => z.id === zona.id)) return
    setAviso('')
    cambiar({ zonasHabituales: [...zonas, zona] })
  }

  const quitarZona = (id: string) => {
    setAviso('')
    if (editandoId === id) setEditandoId(null)
    cambiar({ zonasHabituales: zonas.filter((z) => z.id !== id) })
  }

  const empezarEdicion = (zona: ZonaHabitual) => {
    setAviso('')
    setEditandoId(zona.id)
    setNombreEditado(zona.nombre)
  }

  const guardarNombre = (id: string) => {
    const nombre = nombreEditado.trim()
    if (!nombre) return setAviso('El nombre de la zona no puede quedar vacío.')
    setAviso('')
    cambiar({ zonasHabituales: zonas.map((z) => (z.id === id ? { ...z, nombre } : z)) })
    setEditandoId(null)
  }

  const elegirPunto = (nuevo: [number, number]) => {
    if (llena) return setAviso(`Podés tener hasta ${MAX_ZONAS} zonas habituales. Quitá una para agregar otra.`)
    setAviso('')
    setPunto(nuevo)
  }

  const confirmarPunto = () => {
    if (!punto) return
    const numero = zonas.filter((z) => z.origen === 'mapa').length + 1
    agregarZona({ id: `zona-mapa-${Date.now()}`, nombre: `Punto del mapa ${numero}`, latitud: punto[0], longitud: punto[1], radioM: RADIO_ZONA_M, origen: 'mapa' })
    setPunto(null)
  }

  return (
    <>
      <SubEncabezado titulo="Preferencias" />
      {!hidratado ? (
        <p className="px-5 py-8 text-sm text-slate-500">Cargando preferencias…</p>
      ) : (
        <div className="divide-y">
          <section className="px-5 py-5">
            <h2 className="text-base font-bold text-slate-900">Categorías de interés</h2>
            <p className="mt-1 text-sm text-slate-500">Solo vas a ver y recibir avisos de las categorías activas.</p>
            <ul className="mt-3 divide-y">
              {TIPOS_AFECTACION.map((tipo) => (
                <li key={tipo} className="flex items-center justify-between gap-3 py-3">
                  <span>
                    <strong className="block text-sm text-slate-900">{ETIQUETA_TIPO[tipo]}</strong>
                    <small className="text-xs text-slate-500">{descripcionTipo[tipo]}</small>
                  </span>
                  <Interruptor activo={preferencias.tiposSeguidos.includes(tipo)} onCambio={(activo) => alternarTipo(tipo, activo)} etiqueta={`Avisos de ${ETIQUETA_TIPO[tipo].toLowerCase()}`} />
                </li>
              ))}
            </ul>
          </section>

          <section className="px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-bold text-slate-900">Distancia de anticipación</h2>
              <output className="text-lg font-black text-[#1551A1]">{radio} m</output>
            </div>
            <p className="mt-1 text-sm text-slate-500">Te avisamos cuando una afectación esté dentro de esta distancia.</p>
            <input
              type="range"
              min={200}
              max={2000}
              step={100}
              value={radio}
              onChange={(evento) => cambiar({ radioAnticipacionM: Number(evento.target.value) })}
              aria-label="Distancia de anticipación en metros"
              aria-valuetext={`${radio} metros`}
              className="mt-4 h-8 w-full accent-[#1551A1]"
            />
            <div className="flex justify-between text-xs text-slate-400"><span>200 m</span><span>2000 m</span></div>
          </section>

          <section className="px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <span>
                <h2 className="text-base font-bold text-slate-900">Solo alertas de alto impacto</h2>
                <p className="mt-1 text-sm text-slate-500">Ocultamos las afectaciones de impacto medio y bajo.</p>
              </span>
              <Interruptor activo={Boolean(preferencias.soloAltoImpacto)} onCambio={(activo) => cambiar({ soloAltoImpacto: activo })} etiqueta="Solo alertas de alto impacto" />
            </div>
          </section>

          <section className="px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-bold text-slate-900">Zonas habituales</h2>
              <span className="text-xs font-bold text-slate-500">{zonas.length} de {MAX_ZONAS}</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">Elegí hasta {MAX_ZONAS} zonas de {RADIO_ZONA_M} m, desde la lista o marcándolas en el mapa.</p>

            {zonas.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {zonas.map((zona) => (
                  <li key={zona.id} className="rounded-xl bg-blue-50 py-2 pl-3 pr-1">
                    {editandoId === zona.id ? (
                      <form
                        onSubmit={(evento) => {
                          evento.preventDefault()
                          guardarNombre(zona.id)
                        }}
                        className="flex items-center gap-1"
                      >
                        <label className="sr-only" htmlFor={`nombre-${zona.id}`}>Nombre de la zona</label>
                        <input
                          id={`nombre-${zona.id}`}
                          value={nombreEditado}
                          onChange={(evento) => setNombreEditado(evento.target.value)}
                          onKeyDown={(evento) => evento.key === 'Escape' && setEditandoId(null)}
                          maxLength={MAX_LARGO_NOMBRE}
                          autoFocus
                          className="h-10 min-w-0 flex-1 rounded-lg border border-[#1551A1] bg-white px-3 text-sm font-semibold text-slate-900 outline-none"
                        />
                        <button type="submit" aria-label="Guardar nombre" className="grid size-10 shrink-0 place-items-center text-green-700"><Check size={20} /></button>
                        <button type="button" onClick={() => setEditandoId(null)} aria-label="Cancelar edición" className="grid size-10 shrink-0 place-items-center text-slate-500"><X size={20} /></button>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between gap-1">
                        <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-[#1551A1]"><MapPin size={16} className="shrink-0" aria-hidden="true" /><span className="truncate">{zona.nombre}</span></span>
                        <span className="flex shrink-0">
                          <button onClick={() => empezarEdicion(zona)} aria-label={`Editar nombre de la zona ${zona.nombre}`} className="grid size-10 place-items-center text-slate-500"><Pencil size={18} /></button>
                          <button onClick={() => quitarZona(zona.id)} aria-label={`Quitar zona ${zona.nombre}`} className="grid size-10 place-items-center text-slate-500"><Trash2 size={18} /></button>
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 rounded-xl bg-slate-100 p-3 text-sm text-slate-600">Todavía no elegiste zonas habituales.</p>
            )}

            <h3 className="mt-5 text-sm font-bold text-slate-900">Elegir de la lista</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {zonasPredefinidas.map((zona) => {
                const elegida = zonas.some((z) => z.id === zona.id)
                return (
                  <button key={zona.id} onClick={() => agregarZona(zona)} disabled={elegida} aria-pressed={elegida} className={`rounded-full border px-3 py-2 text-xs font-semibold ${elegida ? 'border-[#1551A1] bg-[#1551A1] text-white' : llena ? 'border-slate-200 text-slate-400' : 'border-slate-300 text-slate-700'}`}>
                    {zona.nombre}
                  </button>
                )
              })}
            </div>

            <h3 className="mt-5 text-sm font-bold text-slate-900">Marcar en el mapa</h3>
            <p className="mt-1 text-xs text-slate-500">Tocá el mapa para ubicar el centro de la zona.</p>
            <div className="mt-2 h-64 overflow-hidden rounded-xl border">
              <MapaZonas zonas={zonas} punto={punto} onElegir={elegirPunto} />
            </div>
            {punto && (
              <div className="mt-3 flex gap-2">
                <button onClick={confirmarPunto} className="flex-1 rounded-full bg-[#1551A1] px-4 py-3 text-sm font-bold text-white">Agregar zona de {RADIO_ZONA_M} m</button>
                <button onClick={() => setPunto(null)} className="rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600">Cancelar</button>
              </div>
            )}
            {aviso && <p role="status" className="mt-3 text-sm font-semibold text-[#C65211]">{aviso}</p>}
            <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-amber-700">DATO SIMULADO · Ubicaciones de la lista aproximadas</p>
          </section>

          <section className="px-5 py-5">
            <h2 className="text-base font-bold text-slate-900">Cómo recibir avisos</h2>
            <p className="mt-1 text-sm text-slate-500">Podés combinar las opciones. En esta demo las tres se simulan en el navegador, sin notificaciones ni ubicación reales.</p>
            <ul className="mt-3 space-y-3">
              {modos.map((modo) => {
                const activo = preferencias.modosAviso[modo.clave]
                return (
                  <li key={modo.clave} className="rounded-xl border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <span>
                        <strong className="block text-sm text-slate-900">{modo.titulo}</strong>
                        <span className="mt-1 block text-sm leading-snug text-slate-600">{modo.descripcion}</span>
                      </span>
                      <Interruptor activo={activo} onCambio={(valor) => cambiar({ modosAviso: { ...preferencias.modosAviso, [modo.clave]: valor } })} etiqueta={modo.titulo} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {modo.requisito && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">{modo.requisito}</span>}
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${activo ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                        {activo ? 'Simulado en la demo' : 'Desactivado'}
                      </span>
                    </div>
                    {activo && <p className="mt-2 text-xs leading-snug text-slate-500">{modo.enDemo}</p>}
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="px-5 py-5">
            <button onClick={() => { setPunto(null); setAviso(''); cambiar(preferenciasIniciales) }} className="w-full rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600">Restablecer preferencias</button>
            <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-wider text-amber-700">DATOS SIMULADOS · Se guardan solo en este navegador</p>
          </section>
        </div>
      )}
    </>
  )
}
