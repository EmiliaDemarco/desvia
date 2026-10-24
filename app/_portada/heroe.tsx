import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BellRing, LayoutDashboard } from 'lucide-react'

export function Heroe() {
  return (
    <div className="grid items-center gap-12 pt-14 pb-20 lg:grid-cols-2 lg:gap-16 lg:pt-20 lg:pb-28">
      <div className="space-y-8">
        <p className="entra inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wide text-white uppercase">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-(--p-naranja)" />
          Rosario · Prototipo con datos simulados
        </p>
        <div className="entra space-y-5 [animation-delay:100ms]">
          <h1 className="titular text-4xl leading-[1.05] font-extrabold text-balance text-white sm:text-5xl lg:text-6xl">
            La ciudad te avisa <span className="text-(--p-naranja)">antes.</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-pretty text-white/80">
            Obras, cortes y desvíos de tránsito informados con anticipación, justo para el recorrido que vas a hacer. Y un panel para que la Municipalidad los gestione en un solo lugar.
          </p>
        </div>
        <div className="entra flex flex-col gap-3 sm:flex-row [animation-delay:200ms]">
          <Link
            href="/movil/desvia"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-(--p-naranja) px-6 py-3.5 text-base font-bold text-(--p-navy) transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Entrar como ciudadano
            <ArrowRight aria-hidden="true" className="size-4 transition group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/tr"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-base font-bold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <LayoutDashboard aria-hidden="true" className="size-4" />
            Panel municipal
          </Link>
        </div>
      </div>

      <div className="entra relative mx-auto w-full max-w-md [animation-delay:250ms] lg:max-w-none">
        <div className="overflow-hidden rounded-3xl border border-white/15 shadow-2xl shadow-black/30">
          <Image
            src="/portada-mapa.png"
            alt="Mapa ilustrado de Rosario con una ruta en naranja y una obra señalizada sobre el recorrido"
            width={1024}
            height={1024}
            priority
            sizes="(min-width: 1024px) 560px, 90vw"
            className="aspect-square h-auto w-full object-cover"
          />
        </div>
        <div className="absolute right-4 bottom-4 left-4 flex items-start gap-3 rounded-2xl bg-white p-4 shadow-xl sm:right-auto sm:max-w-sm lg:-bottom-6 lg:-left-8">
          <span className="relative mt-0.5 flex size-10 shrink-0 items-center justify-center">
            <span aria-hidden="true" className="pulso absolute inset-0" />
            <span className="relative flex size-10 items-center justify-center rounded-full bg-(--p-naranja) text-(--p-navy)">
              <BellRing aria-hidden="true" className="size-5" />
            </span>
          </span>
          <div className="min-w-0 space-y-0.5">
            <p className="text-xs font-bold tracking-wide text-(--p-azul) uppercase">Aviso anticipado</p>
            <p className="text-sm leading-snug font-bold text-(--p-tinta)">Corte parcial en Córdoba y Bv. Oroño</p>
            <p className="text-xs leading-snug text-(--p-tinta)/70">Te afecta en unos 12 minutos. Ejemplo simulado.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
