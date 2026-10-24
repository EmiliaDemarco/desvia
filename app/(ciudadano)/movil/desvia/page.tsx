'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { Crosshair, X } from 'lucide-react'
import { afectacionEnZonas, distanciaHaversineM, RADIO_ANTICIPACION_POR_DEFECTO_M } from '@/lib/alerts/engine'
import { RUTA_JUAN } from '@/lib/alerts/simulacion'
import { ETIQUETA_TIPO, formatearFechaHora, TIPOS_AFECTACION } from '@/lib/formato'
import { useDemoStore } from '@/lib/store'
import type { Afectacion, Estado, TipoAfectacion } from '@/lib/types'
import { useHidratado } from '@/lib/use-hidratado'
import { AlertaBanner } from './alerta-banner'
import { ControlSimulacion } from './control-simulacion'
import { Interruptor } from './interruptor'
import { useSimulacionJuan } from './use-simulacion-juan'

const Mapa = dynamic(() => import('./mapa'), { ssr: false, loading: () => <div className="flex h-full min-h-[430px] items-center justify-center bg-slate-100 text-sm text-slate-500">Cargando mapa simulado…</div> })
const CENTRO_ROSARIO: [number, number] = [-32.9468, -60.6393]
const estados: Array<Estado | 'todos'> = ['todos', 'activa', 'programada', 'resuelta', 'cancelada']
const etiqueta = (valor: string) => valor.charAt(0).toUpperCase() + valor.slice(1)

export default function DesviaPage() {
  return (
    <Suspense fallback={null}>
      <DesviaContenido />
    </Suspense>
  )
}

function DesviaContenido() {
  const router = useRouter()
  const idEnfocado = useSearchParams().get('afectacion')
  const hidratado = useHidratado()
  const afectaciones = useDemoStore((estado) => estado.afectaciones)
  const preferencias = useDemoStore((estado) => estado.preferencias)
  const [tipo, setTipo] = useState<TipoAfectacion | 'todas'>('todas')
  const [estado, setEstado] = useState<Estado | 'todos'>('todos')
  const [aplicarPreferencias, setAplicarPreferencias] = useState(true)
  const [soloMisZonas, setSoloMisZonas] = useState(false)
  const [seleccionada, setSeleccionada] = useState<Afectacion>()
  const [ubicacion, setUbicacion] = useState<[number, number] | null>(null)
  const [mensaje, setMensaje] = useState('')

  const simulacion = useSimulacionJuan({ afectaciones, preferencias })
  const radioM = preferencias.radioAnticipacionM ?? RADIO_ANTICIPACION_POR_DEFECTO_M
  const zonas = preferencias.zonasHabituales
  const filtrarPorZonas = soloMisZonas && zonas.length > 0

  const tiposDisponibles = useMemo(
    () => (aplicarPreferencias ? TIPOS_AFECTACION.filter((t) => preferencias.tiposSeguidos.includes(t)) : TIPOS_AFECTACION),
    [aplicarPreferencias, preferencias.tiposSeguidos],
  )
  const tipoActivo = tipo === 'todas' || tiposDisponibles.includes(tipo) ? tipo : 'todas'

  const filtradas = useMemo(
    () =>
      afectaciones.filter(
        (a) =>
          (tipoActivo === 'todas' || a.tipo === tipoActivo) &&
          (estado === 'todos' || a.estado === estado) &&
          (!aplicarPreferencias || (preferencias.tiposSeguidos.includes(a.tipo) && (!preferencias.soloAltoImpacto || a.impacto === 'alto'))) &&
          (!filtrarPorZonas || afectacionEnZonas(a, zonas)),
      ),
    [afectaciones, tipoActivo, estado, aplicarPreferencias, preferencias.tiposSeguidos, preferencias.soloAltoImpacto, filtrarPorZonas, zonas],
  )

  useEffect(() => {
    if (!idEnfocado) return
    const afectacion = useDemoStore.getState().afectaciones.find((a) => a.id === idEnfocado)
    if (afectacion) {
      setTipo('todas')
      setEstado('todos')
      setAplicarPreferencias(false)
      setSoloMisZonas(false)
      setSeleccionada(afectacion)
      document.getElementById('mapa-desvia')?.scrollIntoView({ block: 'start' })
    }
    router.replace('/movil/desvia', { scroll: false })
  }, [idEnfocado, router])

  const origen = simulacion.juan ?? ubicacion ?? CENTRO_ROSARIO
  const origenEtiqueta = simulacion.juan ? 'recorrido simulado de Juan' : ubicacion ? 'tu ubicación' : 'centro del mapa'
  const cercanas = useMemo(
    () =>
      filtradas
        .map((a) => ({ a, d: distanciaHaversineM({ latitud: origen[0], longitud: origen[1] }, a) }))
        .filter(({ d }) => d < 1000)
        .sort((x, y) => x.d - y.d),
    [filtradas, origen],
  )

  const pedirUbicacion = () => {
    if (!navigator.geolocation) return setMensaje('Ubicación no disponible; seguimos mostrando el centro de Rosario.')
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setUbicacion([p.coords.latitude, p.coords.longitude])
        setMensaje('Ubicación aproximada activa para esta maqueta.')
      },
      () => setMensaje('No se concedió permiso; seguimos mostrando el centro de Rosario.'),
    )
  }

  const verEnMapa = (afectacion: Afectacion) => {
    setTipo('todas')
    setEstado('todos')
    setAplicarPreferencias(false)
    setSoloMisZonas(false)
    setSeleccionada(afectacion)
    simulacion.descartarAlerta()
    document.getElementById('mapa-desvia')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const resumenPreferencias = aplicarPreferencias
    ? `Según tus preferencias: ${preferencias.tiposSeguidos.length} categorías${preferencias.soloAltoImpacto ? ', solo alto impacto' : ''}`
    : 'Mostrando todo, sin filtrar por preferencias'

  return (
    <>
      <div className="sticky top-0 z-[1100] h-0">
        {simulacion.alerta && (
          <AlertaBanner alerta={simulacion.alerta} onVerEnMapa={() => verEnMapa(simulacion.alerta!.principal.afectacion)} onCerrar={simulacion.descartarAlerta} />
        )}
      </div>
      <div className="bg-slate-100 px-5 py-3">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">DATOS SIMULADOS</p>
        <h1 className="text-2xl font-black text-[#1551A1]">desv<span className="text-[#F26B1D]">IA</span></h1>
      </div>
      <div className="space-y-3 border-b bg-white px-4 py-3">
        <button onClick={pedirUbicacion} className="flex items-center gap-2 rounded-full bg-[#1551A1] px-4 py-2 text-xs font-bold text-white"><Crosshair size={15} /> Usar mi ubicación</button>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['todas', ...tiposDisponibles] as Array<TipoAfectacion | 'todas'>).map((item) => (
            <button key={item} onClick={() => setTipo(item)} aria-pressed={tipoActivo === item} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${tipoActivo === item ? 'border-[#1551A1] bg-[#1551A1] text-white' : 'border-slate-200 text-slate-600'}`}>
              {item === 'todas' ? 'Todas' : ETIQUETA_TIPO[item]}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {zonas.length > 0 && (
            <button onClick={() => setSoloMisZonas((valor) => !valor)} aria-pressed={filtrarPorZonas} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${filtrarPorZonas ? 'border-[#1551A1] bg-blue-50 text-[#1551A1]' : 'border-slate-200 text-slate-600'}`}>
              Mis zonas ({zonas.length})
            </button>
          )}
          {estados.map((item) => (
            <button key={item} onClick={() => setEstado(item)} aria-pressed={estado === item} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${estado === item ? 'border-[#F26B1D] bg-orange-50 text-[#C65211]' : 'border-slate-200 text-slate-600'}`}>{etiqueta(item)}</button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            {hidratado ? resumenPreferencias : 'Cargando preferencias…'}{' '}
            <Link href="/movil/desvia/preferencias" className="font-bold text-[#1551A1] underline">Editar</Link>
          </p>
          <Interruptor activo={aplicarPreferencias} onCambio={setAplicarPreferencias} etiqueta="Aplicar mis preferencias al mapa" />
        </div>
      </div>
      <ControlSimulacion estado={simulacion.estado} paso={simulacion.paso} totalPasos={simulacion.totalPasos} onIniciar={simulacion.iniciar} onAlternarPausa={simulacion.alternarPausa} />
      <div id="mapa-desvia" className="h-[430px]">
        <Mapa
          afectaciones={filtradas}
          seleccionada={seleccionada}
          onSeleccionar={setSeleccionada}
          ubicacion={ubicacion}
          ruta={simulacion.estado === 'inactiva' ? undefined : RUTA_JUAN}
          juan={simulacion.juan}
          radioM={radioM}
          reinicioId={simulacion.reinicioId}
          zonas={zonas}
        />
      </div>
      {mensaje && <p className="px-5 py-2 text-xs text-slate-500">{mensaje}</p>}
      <section className="space-y-3 px-5 py-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Cerca tuyo</h2>
          <p className="text-sm text-slate-500">{cercanas.length} afectaciones a menos de 1000 m · {origenEtiqueta}</p>
        </div>
        {cercanas.slice(0, 3).map(({ a, d }) => (
          <button key={a.id} onClick={() => setSeleccionada(a)} className="flex w-full items-center justify-between gap-3 border-b py-3 text-left">
            <span>
              <strong className="block text-sm text-slate-900">{a.titulo}</strong>
              <small className="text-xs text-slate-500">{a.direccion} · {Math.round(d)} m</small>
            </span>
            <span className="text-xs font-bold text-[#1551A1]">{etiqueta(a.estado)}</span>
          </button>
        ))}
        <p className="pt-2 text-xs text-slate-400">Actualizado: 24/10 12:17 · DATO SIMULADO</p>
      </section>
      {seleccionada && <Detalle afectacion={seleccionada} cerrar={() => setSeleccionada(undefined)} />}
    </>
  )
}

function Detalle({ afectacion, cerrar }: { afectacion: Afectacion; cerrar: () => void }) {
  return (
    <div className="sticky bottom-0 z-[1000] h-0">
      <div role="dialog" aria-label={`Detalle: ${afectacion.titulo}`} className="absolute inset-x-0 bottom-0 max-h-[60dvh] overflow-auto rounded-t-3xl bg-white p-5 shadow-[0_-8px_30px_rgba(0,0,0,.18)]">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">DATO SIMULADO · {afectacion.confiabilidad}</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">{afectacion.titulo}</h2>
          </div>
          <button onClick={cerrar} aria-label="Cerrar detalle" className="grid size-10 shrink-0 place-items-center"><X /></button>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Tipo" value={afectacion.tipo} />
          <Info label="Estado" value={afectacion.estado} />
          <Info label="Impacto" value={afectacion.impacto} />
          <Info label="Dirección" value={afectacion.direccion} />
          <Info label="Inicio" value={formatearFechaHora(afectacion.inicio)} />
          <Info label="Fin estimado" value={afectacion.fin ? formatearFechaHora(afectacion.fin) : 'En curso'} />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">{afectacion.descripcion}</p>
        <div className="mt-4 rounded-xl bg-slate-100 p-4 text-xs text-slate-600">
          <p>Última actualización: {formatearFechaHora(afectacion.actualizadaEn)}</p>
          <p className="mt-1">Fuente: {afectacion.fuente}</p>
          <p className="mt-1">Confiabilidad: <strong>{afectacion.confiabilidad}</strong></p>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="font-semibold capitalize text-slate-700">{value}</dd>
    </div>
  )
}
