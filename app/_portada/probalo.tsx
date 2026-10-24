import Link from 'next/link'
import { ArrowRight, Columns2, Play, Sparkles } from 'lucide-react'

const ENLACES = [
  {
    href: '/demo',
    icono: Play,
    titulo: 'Guía de la demostración',
    texto: 'Seis escenarios paso a paso, listos para recorrer.',
  },
  {
    href: '/demo/split',
    icono: Columns2,
    titulo: 'Ver los dos lados en vivo',
    texto: 'Panel municipal y celular juntos: publicás y se actualiza al instante.',
  },
  {
    href: '/evolucion',
    icono: Sparkles,
    titulo: 'Evolución con IA',
    texto: 'Las tres etapas de la propuesta, de lo implementado a la visión futura.',
  },
]

export function Probalo() {
  return (
    <section aria-labelledby="titulo-probalo" className="rounded-3xl bg-(--p-navy) p-7 sm:p-10">
      <div className="max-w-2xl space-y-2">
        <h2 id="titulo-probalo" className="titular text-3xl font-extrabold text-balance text-white sm:text-4xl">
          Probalo en vivo
        </h2>
        <p className="text-base leading-relaxed text-white/75">
          Todo funciona de verdad con datos simulados. Elegí por dónde empezar.
        </p>
      </div>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {ENLACES.map((enlace) => (
          <li key={enlace.href}>
            <Link
              href={enlace.href}
              className="group flex h-full flex-col gap-4 rounded-2xl border border-white/15 bg-white/5 p-5 transition hover:border-(--p-naranja) hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-(--p-naranja) text-(--p-navy)">
                <enlace.icono aria-hidden="true" className="size-5" />
              </span>
              <div className="space-y-1.5">
                <h3 className="titular text-lg font-extrabold text-white">{enlace.titulo}</h3>
                <p className="text-sm leading-relaxed text-white/70">{enlace.texto}</p>
              </div>
              <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-white">
                Ir
                <ArrowRight aria-hidden="true" className="size-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
