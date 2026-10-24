'use client'

import { AlertTriangle, X } from 'lucide-react'
import type { TipoAfectacion } from '@/lib/types'
import type { AlertaActiva } from './use-simulacion-juan'

const categorias: Record<TipoAfectacion, string> = {
  obra: 'Obra',
  corte: 'Corte',
  poda: 'Poda',
  accidente: 'Accidente',
  congestion: 'Congestión',
  evento: 'Evento',
}

const hora = (iso: string) => new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Argentina/Buenos_Aires' })
const distanciaAproximada = (metros: number) => `aprox. ${Math.max(50, Math.round(metros / 50) * 50)} m`

export function AlertaBanner({ alerta, onVerEnMapa, onCerrar }: { alerta: AlertaActiva; onVerEnMapa: () => void; onCerrar: () => void }) {
  const { principal, adicionales } = alerta
  const { afectacion, distanciaM, motivo } = principal

  return (
    <div role="alert" className="absolute inset-x-2 top-2 rounded-2xl border border-orange-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,.25)]">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-[#F26B1D] text-white">
          <AlertTriangle size={18} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
            DATO SIMULADO{motivo === 'actualizacion' ? ' · Actualización' : ''}
          </p>
          <h2 className="text-balance text-sm font-bold leading-snug text-slate-900">{afectacion.titulo}</h2>
          <p className="mt-1 text-pretty text-xs leading-relaxed text-slate-600">
            Estás próximo a una zona con afectaciones. Consultá el mapa para conocer los detalles y evaluar tu recorrido.
          </p>
        </div>
        <button onClick={onCerrar} aria-label="Cerrar alerta" className="text-slate-400">
          <X size={18} />
        </button>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 rounded-xl bg-slate-100 p-3 text-xs">
        <Dato etiqueta="Categoría" valor={categorias[afectacion.tipo]} />
        <Dato etiqueta="Distancia" valor={distanciaAproximada(distanciaM)} />
        <Dato etiqueta="Ubicación" valor={afectacion.direccion} />
        <Dato etiqueta="Actualizado" valor={`${hora(afectacion.actualizadaEn)} hs`} />
        <Dato etiqueta="Fuente" valor={afectacion.fuente} ancho />
      </dl>

      {adicionales > 0 && <p className="mt-2 text-xs text-slate-500">Hay {adicionales} {adicionales === 1 ? 'afectación más' : 'afectaciones más'} dentro de tu radio.</p>}

      <button onClick={onVerEnMapa} className="mt-3 w-full rounded-full bg-[#1551A1] py-2.5 text-sm font-bold text-white">
        Ver en el mapa
      </button>
      <p className="mt-2 text-center text-[10px] text-slate-400">Simulación en el navegador. No es una notificación push real.</p>
    </div>
  )
}

function Dato({ etiqueta, valor, ancho }: { etiqueta: string; valor: string; ancho?: boolean }) {
  return (
    <div className={ancho ? 'col-span-2' : undefined}>
      <dt className="text-[10px] uppercase tracking-wide text-slate-400">{etiqueta}</dt>
      <dd className="font-semibold text-slate-700">{valor}</dd>
    </div>
  )
}
