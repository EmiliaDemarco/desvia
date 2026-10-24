import type { Metadata } from 'next'
import Link from 'next/link'
import { Eye, Lock, ShieldCheck } from 'lucide-react'
import { LineaTiempo } from './_componentes/linea-tiempo'

export const metadata: Metadata = {
  title: 'desvIA · Evolución con IA',
  description: 'Tres etapas para que desvIA pase de informar a anticipar, con límites de privacidad y supervisión humana.',
}

export default function EvolucionPage() {
  return (
    <main className="min-h-dvh bg-[#e6ebf3] text-[#0f1b33]">
      <header className="bg-[#0f2a52] px-4 py-5 text-[#f3f5f9] sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          <nav aria-label="Volver" className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
            <Link href="/movil/desvia" className="underline decoration-[#F26B1D] underline-offset-4 hover:text-[#ffffff]">
              Volver a desvIA (ciudadano)
            </Link>
            <Link href="/tr" className="underline decoration-[#F26B1D] underline-offset-4 hover:text-[#ffffff]">
              Ir al panel municipal
            </Link>
            <Link href="/demo" className="underline decoration-[#F26B1D] underline-offset-4 hover:text-[#ffffff]">
              Guía de la demo
            </Link>
          </nav>
          <div>
            <h1 className="text-balance text-2xl font-black tracking-tight sm:text-3xl">
              Evolución con IA
            </h1>
            <p className="mt-1 text-pretty text-sm leading-relaxed text-[#c9d4e6] sm:text-base">
              desv<span className="text-[#F26B1D]">IA</span> crece en etapas: primero informa, después analiza y, más adelante, ayuda a anticipar.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">
        <LineaTiempo />

        <section aria-labelledby="titulo-privacidad" className="rounded-xl border border-[#1551A1] bg-[#ffffff] p-4 sm:p-5">
          <h2 id="titulo-privacidad" className="flex items-center gap-2 text-base font-black text-[#1551A1]">
            <ShieldCheck className="size-5 shrink-0" aria-hidden="true" />
            Privacidad y límites
          </h2>
          <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-[#2c3a52]">
            <li>Sin reconocimiento de patentes ni de personas.</li>
            <li>Solo conteos agregados: no se guardan imágenes ni video.</li>
            <li>La IA sugiere; el operador revisa y decide qué se publica.</li>
          </ul>
        </section>

        <section aria-labelledby="titulo-semaforos" className="rounded-xl border border-dashed border-[#4b5870] bg-[#ffffff] p-4 sm:p-5">
          <h2 id="titulo-semaforos" className="flex items-center gap-2 text-base font-black text-[#0f1b33]">
            <Lock className="size-5 shrink-0" aria-hidden="true" />
            Control de semáforos
          </h2>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-[#2c3a52]">
            Es una etapa independiente y queda fuera del alcance de este prototipo. Si algún día se estudiara, requeriría supervisión humana obligatoria.
          </p>
        </section>

        <p className="flex items-start gap-2 text-xs leading-relaxed text-[#4b5870]">
          <Eye className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Prototipo de demostración con datos simulados. No es un sistema municipal existente ni implica un compromiso de la Municipalidad.
        </p>
      </div>
    </main>
  )
}
