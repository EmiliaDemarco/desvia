'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { useDemoStore } from '@/lib/store'

export function ReinicioDemo() {
  const resetDemo = useDemoStore((s) => s.resetDemo)
  const [confirmando, setConfirmando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const reiniciar = () => {
    resetDemo()
    setConfirmando(false)
    setMensaje('Datos de demo reiniciados. Afectaciones, avisos, sugerencias e historial volvieron al estado inicial.')
  }

  return (
    <section aria-labelledby="titulo-reinicio" className="rounded-xl border border-dashed border-[#4b5870] bg-[#ffffff] p-4 sm:p-5">
      <h2 id="titulo-reinicio" className="text-sm font-black text-[#0f1b33]">
        Empezar de cero
      </h2>
      <p className="mt-1 text-pretty text-sm leading-relaxed text-[#2c3a52]">
        Vuelve todo al estado inicial para repetir la demostración. Se pierden las afectaciones, avisos, sugerencias y cambios del historial que hayas generado.
      </p>

      {confirmando ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={reiniciar}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#F26B1D] px-5 text-sm font-bold text-[#1a0d03] outline-none hover:bg-[#d95a10] focus-visible:ring-2 focus-visible:ring-[#0f2a52] focus-visible:ring-offset-2"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Sí, reiniciar ahora
          </button>
          <button
            type="button"
            onClick={() => setConfirmando(false)}
            className="min-h-11 rounded-lg border border-[#4b5870] px-5 text-sm font-bold text-[#0f1b33] outline-none hover:bg-[#f3f5f9] focus-visible:ring-2 focus-visible:ring-[#1551A1]"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setMensaje('')
            setConfirmando(true)
          }}
          className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#0f2a52] px-5 text-sm font-bold text-[#0f2a52] outline-none hover:bg-[#f3f5f9] focus-visible:ring-2 focus-visible:ring-[#1551A1]"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Reiniciar datos de demo
        </button>
      )}

      <p role="status" className={mensaje ? 'mt-3 rounded-lg bg-[#e3eefb] p-3 text-sm leading-relaxed text-[#0f3d7a]' : 'sr-only'}>
        {mensaje}
      </p>
    </section>
  )
}
