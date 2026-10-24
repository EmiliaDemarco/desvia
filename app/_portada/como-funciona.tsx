import { BellRing, Construction, Route } from 'lucide-react'

const PASOS = [
  {
    icono: Construction,
    titulo: 'El operador publica',
    texto: 'Carga una obra, un corte o un desvío con su ubicación, su horario y su impacto.',
  },
  {
    icono: Route,
    titulo: 'desvIA cruza con tu recorrido',
    texto: 'Compara la afectación con tus zonas habituales y el camino que estás por hacer.',
  },
  {
    icono: BellRing,
    titulo: 'Te avisa antes de salir',
    texto: 'Recibís la alerta con tiempo para elegir otro camino, sin sorpresas en la calle.',
  },
]

export function ComoFunciona() {
  return (
    <section aria-labelledby="titulo-como" className="space-y-8">
      <h2 id="titulo-como" className="titular text-3xl font-extrabold text-balance text-(--p-navy) sm:text-4xl">
        Cómo funciona
      </h2>
      <ol className="grid gap-6 md:grid-cols-3">
        {PASOS.map((paso, indice) => (
          <li key={paso.titulo} className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--p-navy) text-white">
                <paso.icono aria-hidden="true" className="size-5" />
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-(--p-navy)/15 md:block" />
              <span className="titular text-sm font-extrabold text-(--p-azul)">Paso {indice + 1}</span>
            </div>
            <h3 className="titular text-xl font-extrabold text-(--p-navy)">{paso.titulo}</h3>
            <p className="text-sm leading-relaxed text-(--p-tinta)/70">{paso.texto}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
