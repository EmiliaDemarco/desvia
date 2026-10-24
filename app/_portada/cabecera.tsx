import Link from 'next/link'

const ENLACES = [
  { href: '/demo', texto: 'Guía de la demostración' },
  { href: '/demo/split', texto: 'Ver en vivo' },
  { href: '/evolucion', texto: 'Evolución con IA' },
]

export function Cabecera() {
  return (
    <header className="flex items-center justify-between gap-6">
      <Link
        href="/"
        aria-label="desvIA, inicio"
        className="titular text-2xl font-extrabold tracking-tight text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--p-naranja)"
      >
        desv<span className="text-(--p-naranja)">IA</span>
      </Link>
      <nav aria-label="Secciones de la demostración" className="hidden items-center gap-6 md:flex">
        {ENLACES.map((enlace) => (
          <Link
            key={enlace.href}
            href={enlace.href}
            className="text-sm font-semibold text-white/80 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--p-naranja)"
          >
            {enlace.texto}
          </Link>
        ))}
      </nav>
    </header>
  )
}
