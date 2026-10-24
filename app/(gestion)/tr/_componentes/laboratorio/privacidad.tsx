import { ShieldCheck } from 'lucide-react'

const PUNTOS = [
  'No se guardan imágenes ni video: los cuadros se analizan en este navegador y se descartan al instante.',
  'No se detectan patentes ni personas. El análisis solo considera autos, camiones, ómnibus y motos, y descarta cualquier otra clase.',
  'Solo se conservan conteos agregados por segundo. No se identifica a ningún vehículo ni a ninguna persona.',
  'La IA sugiere y el operador decide: ninguna sugerencia se publica sin su aprobación.',
]

export function Privacidad() {
  return (
    <aside aria-labelledby="titulo-privacidad" className="flex flex-col gap-3 rounded-lg border border-primary bg-secondary p-4">
      <h2 id="titulo-privacidad" className="flex items-center gap-2 text-base font-bold text-primary">
        <ShieldCheck className="size-5" aria-hidden="true" />
        Privacidad
      </h2>
      <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed marker:text-primary">
        {PUNTOS.map((punto) => (
          <li key={punto}>{punto}</li>
        ))}
      </ul>
    </aside>
  )
}
