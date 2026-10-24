import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { PasoDemo } from './pasos'

interface TarjetaPasoProps {
  paso: PasoDemo
  numero: number
}

const ESTILO_ROL = {
  Ciudadano: 'bg-[#e3eefb] text-[#0f3d7a]',
  Operador: 'bg-[#fff1e8] text-[#7a3105]',
} as const

export function TarjetaPaso({ paso, numero }: TarjetaPasoProps) {
  return (
    <li className="flex gap-3 rounded-xl border border-[#d5dce8] bg-[#ffffff] p-4 sm:gap-4 sm:p-5">
      <span
        className="grid size-9 shrink-0 place-items-center rounded-full bg-[#0f2a52] text-sm font-black text-[#ffffff]"
        aria-hidden="true"
      >
        {numero}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className={`w-fit rounded-md px-2 py-0.5 text-xs font-bold ${ESTILO_ROL[paso.rol]}`}>{paso.rol}</span>
        <h2 className="text-balance text-base font-black leading-snug text-[#0f1b33] sm:text-lg">
          <span className="sr-only">Paso {numero}: </span>
          {paso.titulo}
        </h2>
        <p className="text-pretty text-sm leading-relaxed text-[#2c3a52]">{paso.queHacer}</p>
        <Link
          href={paso.href}
          aria-label={`Ir al paso ${numero}: ${paso.titulo}`}
          className="mt-1 inline-flex min-h-11 w-fit items-center gap-2 rounded-lg bg-[#1551A1] px-5 text-sm font-bold text-[#ffffff] outline-none hover:bg-[#0f3d7a] focus-visible:ring-2 focus-visible:ring-[#F26B1D] focus-visible:ring-offset-2"
        >
          Ir
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </li>
  )
}
