import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function SubEncabezado({ titulo }: { titulo: string }) {
  return (
    <div className="flex items-center gap-2 bg-slate-100 px-3 py-3">
      <Link href="/movil/desvia" aria-label="Volver al mapa de desvIA" className="grid size-10 place-items-center rounded-full text-[#1551A1]">
        <ArrowLeft size={22} />
      </Link>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">DATOS SIMULADOS</p>
        <h1 className="text-xl font-black leading-tight text-[#1551A1]">{titulo}</h1>
      </div>
    </div>
  )
}
