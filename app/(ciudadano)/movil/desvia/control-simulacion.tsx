'use client'

import { Navigation, Pause, Play, RotateCcw } from 'lucide-react'
import type { EstadoSimulacion } from './use-simulacion-juan'

interface Props {
  estado: EstadoSimulacion
  paso: number
  totalPasos: number
  onIniciar: () => void
  onAlternarPausa: () => void
}

const etiquetaEstado: Record<EstadoSimulacion, string> = {
  inactiva: '',
  corriendo: 'Juan avanza por Av. Pellegrini',
  pausada: 'Recorrido en pausa',
  finalizada: 'Juan llegó al Parque Independencia',
}

export function ControlSimulacion({ estado, paso, totalPasos, onIniciar, onAlternarPausa }: Props) {
  if (estado === 'inactiva') {
    return (
      <div className="border-b bg-white px-4 py-3">
        <button onClick={onIniciar} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#F26B1D] py-2.5 text-sm font-bold text-white">
          <Navigation size={16} aria-hidden="true" /> Simular recorrido de Juan
        </button>
        <p className="mt-2 text-center text-[10px] text-slate-400">DATO SIMULADO · recorrido ficticio, hora simulada 24/10 12:20</p>
      </div>
    )
  }

  const botonSecundario = 'flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40'

  return (
    <div className="flex items-center justify-between gap-3 border-b bg-white px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-slate-800">{etiquetaEstado[estado]}</p>
        <p className="text-[10px] text-slate-400">Paso {paso}/{totalPasos} · DATO SIMULADO</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button onClick={onAlternarPausa} disabled={estado === 'finalizada'} className={botonSecundario}>
          {estado === 'corriendo' ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
          {estado === 'corriendo' ? 'Pausar' : 'Reanudar'}
        </button>
        <button onClick={onIniciar} className={botonSecundario}>
          <RotateCcw size={14} aria-hidden="true" /> Reiniciar
        </button>
      </div>
    </div>
  )
}
