'use client'

import { useDemoStore } from '@/lib/store'
import { useHidratado } from '@/lib/use-hidratado'

export function EstadoDatos() {
  const hidratado = useHidratado()
  const activas = useDemoStore((s) => s.afectaciones.filter((a) => a.estado === 'activa').length)
  const programadas = useDemoStore((s) => s.afectaciones.filter((a) => a.estado === 'programada').length)
  const sinLeer = useDemoStore((s) => s.notificaciones.filter((n) => !n.leida).length)
  const pendientes = useDemoStore((s) => s.sugerencias.filter((g) => g.estado === 'pendiente').length)
  const cambios = useDemoStore((s) => s.historial.length)

  const datos = [
    { etiqueta: 'Activas', valor: activas },
    { etiqueta: 'Programadas', valor: programadas },
    { etiqueta: 'Avisos sin leer', valor: sinLeer },
    { etiqueta: 'Sugerencias IA pendientes', valor: pendientes },
    { etiqueta: 'Cambios en el historial', valor: cambios },
  ]

  return (
    <section aria-labelledby="titulo-estado" className="rounded-xl border border-[#d5dce8] bg-[#ffffff] p-4 sm:p-5">
      <h2 id="titulo-estado" className="text-sm font-black text-[#0f1b33]">
        Estado actual de los datos de la demo
      </h2>
      <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {datos.map((dato) => (
          <div key={dato.etiqueta} className="flex flex-col gap-0.5 rounded-lg bg-[#f3f5f9] p-3">
            <dt className="text-xs leading-snug text-[#4b5870]">{dato.etiqueta}</dt>
            <dd className="text-2xl font-black text-[#0f1b33]">{hidratado ? dato.valor : '–'}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
