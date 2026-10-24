'use client'

import { useState } from 'react'
import { EstadoSincronizacion } from './estado-sincronizacion'
import { MarcoCelular } from './marco-celular'
import { MarcoPanel } from './marco-panel'

type Vista = 'panel' | 'celular'

const VISTAS: { id: Vista; etiqueta: string }[] = [
  { id: 'panel', etiqueta: 'Panel municipal' },
  { id: 'celular', etiqueta: 'Celular ciudadano' },
]

export function VistaDividida() {
  const [vista, setVista] = useState<Vista>('panel')

  return (
    <main className="flex h-dvh flex-col bg-[#e6ebf3] text-[#0f1b33]">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-1 bg-[#0f2a52] px-4 py-2.5 text-[#f3f5f9]">
        <div className="min-w-0">
          <h1 className="text-base font-black tracking-tight sm:text-lg">
            desv<span className="text-[#F26B1D]">IA</span> · Demostración en vivo
          </h1>
          <p className="text-xs leading-snug text-[#c9d4e6] sm:text-sm">
            Lo que publica el operador aparece al instante en el celular. Datos simulados.
          </p>
        </div>
        <nav aria-label="Abrir por separado" className="flex items-center gap-4 text-xs font-semibold sm:text-sm">
          <a href="/tr" target="_blank" rel="noreferrer" className="underline decoration-[#F26B1D] underline-offset-4 hover:text-[#ffffff]">
            Abrir panel en otra pestaña
          </a>
          <a href="/movil/desvia" target="_blank" rel="noreferrer" className="underline decoration-[#F26B1D] underline-offset-4 hover:text-[#ffffff]">
            Abrir celular en otra pestaña
          </a>
        </nav>
      </header>

      <EstadoSincronizacion />

      <div role="tablist" aria-label="Vista" className="flex shrink-0 gap-1 border-b border-[#d5dce8] bg-[#ffffff] p-1 lg:hidden">
        {VISTAS.map((item) => (
          <button
            key={item.id}
            id={`tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={vista === item.id}
            aria-controls={`vista-${item.id}`}
            onClick={() => setVista(item.id)}
            className={`min-h-10 flex-1 rounded-md px-3 text-sm font-bold transition-colors ${vista === item.id ? 'bg-[#1551A1] text-[#ffffff]' : 'text-[#4b5870] hover:bg-[#f3f5f9]'}`}
          >
            {item.etiqueta}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 gap-4 p-3 lg:p-4">
        <section
          id="vista-panel"
          role="tabpanel"
          aria-labelledby="tab-panel"
          className={`${vista === 'panel' ? 'flex' : 'hidden'} min-h-0 min-w-0 flex-1 flex-col gap-2 lg:flex`}
        >
          <h2 className="hidden shrink-0 text-sm font-bold lg:block">
            Operador municipal <span className="font-medium text-[#4b5870]">· desvIA TR</span>
          </h2>
          <MarcoPanel />
        </section>

        <section
          id="vista-celular"
          role="tabpanel"
          aria-labelledby="tab-celular"
          className={`${vista === 'celular' ? 'flex' : 'hidden'} min-h-0 min-w-0 flex-1 flex-col items-center gap-2 lg:w-[410px] lg:flex-none lg:shrink-0 lg:flex`}
        >
          <h2 className="hidden shrink-0 text-sm font-bold lg:block">
            Ciudadano <span className="font-medium text-[#4b5870]">· Movil-TR + desvIA</span>
          </h2>
          <MarcoCelular />
        </section>
      </div>
    </main>
  )
}
