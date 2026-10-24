import Link from 'next/link'

const DESTINOS = [
  { href: '/', texto: 'Inicio' },
  { href: '/movil/desvia', texto: 'Mapa ciudadano' },
  { href: '/tr', texto: 'Panel municipal' },
  { href: '/demo', texto: 'Guía de la demostración' },
]

export default function NoEncontrada() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B1F3A] px-6 py-16 text-[#ffffff]">
      <div className="flex max-w-lg flex-col items-center gap-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#F26B1D]">Error 404 · Desvío</p>
        <h1 className="text-balance text-4xl font-bold">Esta calle no lleva a ningún lado</h1>
        <p className="text-pretty leading-relaxed text-[#C9D3E3]">
          La página que buscás no existe o cambió de lugar. Elegí un destino para seguir recorriendo desvIA.
        </p>
        <nav aria-label="Destinos sugeridos" className="flex flex-wrap justify-center gap-3">
          {DESTINOS.map((destino, indice) => (
            <Link
              key={destino.href}
              href={destino.href}
              className={
                indice === 0
                  ? 'inline-flex min-h-11 items-center rounded-lg bg-[#F26B1D] px-5 text-sm font-bold text-[#0B1F3A] outline-none hover:bg-[#ff8340] focus-visible:ring-2 focus-visible:ring-[#ffffff]'
                  : 'inline-flex min-h-11 items-center rounded-lg border border-[#ffffff]/25 px-5 text-sm font-semibold outline-none hover:bg-[#ffffff]/10 focus-visible:ring-2 focus-visible:ring-[#ffffff]'
              }
            >
              {destino.texto}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  )
}
