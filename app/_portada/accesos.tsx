import Link from 'next/link'
import { ArrowRight, Check, LayoutDashboard, Smartphone } from 'lucide-react'

const CIUDADANO = [
  'Mapa de la ciudad con filtros por tipo y estado',
  'Avisos anticipados según tu recorrido y tus zonas',
  'Notificaciones y preferencias a tu medida',
]

const GESTION = [
  'Carga, publicación y resolución de afectaciones',
  'Indicadores y análisis de cámaras de demostración',
  'Historial de cada cambio, con usuario y hora',
]

function Lista({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-(--p-tinta)/80">
          <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-(--p-azul)" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export function Accesos() {
  return (
    <section aria-labelledby="titulo-accesos" className="space-y-8">
      <div className="max-w-2xl space-y-2">
        <h2 id="titulo-accesos" className="titular text-3xl font-extrabold text-balance text-(--p-navy) sm:text-4xl">
          Una misma información, dos experiencias
        </h2>
        <p className="text-base leading-relaxed text-(--p-tinta)/70">
          Lo que publica el operador aparece al instante para el ciudadano.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Link
          href="/movil/desvia"
          className="group flex flex-col gap-6 rounded-3xl border border-(--p-navy)/10 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--p-azul)"
        >
          <span className="flex size-12 items-center justify-center rounded-2xl bg-(--p-cielo) text-(--p-azul)">
            <Smartphone aria-hidden="true" className="size-6" />
          </span>
          <div className="space-y-2">
            <p className="text-xs font-bold tracking-wide text-(--p-tinta)/60 uppercase">Acceso ciudadano</p>
            <h3 className="titular text-2xl font-extrabold text-(--p-navy)">Movil-TR + desvIA</h3>
            <p className="text-sm leading-relaxed text-(--p-tinta)/70">
              La app para consultar afectaciones y recibir avisos antes de salir.
            </p>
          </div>
          <Lista items={CIUDADANO} />
          <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-bold text-(--p-azul)">
            Entrar a la experiencia ciudadana
            <ArrowRight aria-hidden="true" className="size-4 transition group-hover:translate-x-1" />
          </span>
        </Link>

        <Link
          href="/tr"
          className="group flex flex-col gap-6 rounded-3xl border border-(--p-navy)/10 bg-(--p-cielo) p-7 transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--p-azul)"
        >
          <span className="flex size-12 items-center justify-center rounded-2xl bg-(--p-navy) text-white">
            <LayoutDashboard aria-hidden="true" className="size-6" />
          </span>
          <div className="space-y-2">
            <p className="text-xs font-bold tracking-wide text-(--p-tinta)/60 uppercase">Acceso gestión</p>
            <h3 className="titular text-2xl font-extrabold text-(--p-navy)">Panel municipal desvIA TR</h3>
            <p className="text-sm leading-relaxed text-(--p-tinta)/70">
              El espacio donde el equipo municipal gestiona y publica las afectaciones.
            </p>
          </div>
          <Lista items={GESTION} />
          <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-bold text-(--p-azul)">
            Entrar al panel municipal
            <ArrowRight aria-hidden="true" className="size-4 transition group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </section>
  )
}
