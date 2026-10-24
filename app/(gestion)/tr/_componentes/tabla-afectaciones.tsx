'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { ESTADOS, formatearFechaHora, NOMBRE_ESTADO, NOMBRE_IMPACTO, NOMBRE_TIPO, TIPOS_AFECTACION } from '@/lib/formato'
import { useDemoStore } from '@/lib/store'
import type { Afectacion, Estado, TipoAfectacion } from '@/lib/types'
import { useHidratado } from '@/lib/use-hidratado'
import { AccionesAfectacion } from './acciones-afectacion'
import { Campo, CLASE_CAMPO } from './campos'
import { EtiquetaSimulado } from './etiqueta-simulado'
import { InsigniaEstado, InsigniaPublicacion } from './insignias'
import { EsqueletoCarga } from './no-encontrada'

const normalizar = (texto: string) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

function Periodo({ afectacion }: { afectacion: Afectacion }) {
  return (
    <span className="text-xs tabular-nums text-muted-foreground">
      {formatearFechaHora(afectacion.inicio)}
      {afectacion.fin ? ` → ${formatearFechaHora(afectacion.fin)}` : ' → sin fin estimado'}
    </span>
  )
}

function Titulo({ afectacion }: { afectacion: Afectacion }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <Link href={`/tr/afectaciones/${afectacion.id}`} className="text-sm font-semibold text-primary underline-offset-2 outline-none hover:underline focus-visible:underline">
        {afectacion.titulo}
      </Link>
      <span className="text-xs text-muted-foreground">{afectacion.direccion}</span>
      <span className="text-xs text-muted-foreground">
        {NOMBRE_TIPO[afectacion.tipo]} · Impacto {NOMBRE_IMPACTO[afectacion.impacto].toLowerCase()}
      </span>
    </div>
  )
}

export function TablaAfectaciones() {
  const hidratado = useHidratado()
  const afectaciones = useDemoStore((s) => s.afectaciones)
  const [busqueda, setBusqueda] = useState('')
  const [tipo, setTipo] = useState<TipoAfectacion | 'todos'>('todos')
  const [estado, setEstado] = useState<Estado | 'todos'>('todos')
  const [mensaje, setMensaje] = useState('')

  const filtradas = useMemo(() => {
    const termino = normalizar(busqueda.trim())
    return afectaciones
      .filter((a) => tipo === 'todos' || a.tipo === tipo)
      .filter((a) => estado === 'todos' || a.estado === estado)
      .filter((a) => !termino || normalizar(`${a.titulo} ${a.direccion} ${a.id} ${a.zona}`).includes(termino))
      .sort((a, b) => Date.parse(b.inicio) - Date.parse(a.inicio))
  }, [afectaciones, busqueda, tipo, estado])

  if (!hidratado) return <EsqueletoCarga />

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 p-4 lg:p-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-balance text-2xl font-bold">Afectaciones</h1>
            <EtiquetaSimulado />
          </div>
          <p className="text-pretty text-sm text-muted-foreground">
            Lo que se publica acá se refleja en el mapa ciudadano, en los indicadores y en el motor de alertas.
          </p>
        </div>
        <Link
          href="/tr/afectaciones/nueva"
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Plus className="size-4" aria-hidden="true" />
          Nueva afectación
        </Link>
      </header>

      <div role="status" aria-live="polite" className={mensaje ? 'rounded-lg border border-primary bg-secondary p-3 text-sm font-medium' : 'sr-only'}>
        {mensaje}
      </div>

      <section aria-label="Filtros" className="grid gap-3 sm:grid-cols-[1fr_11rem_11rem]">
        <Campo etiqueta="Buscar">
          {(control) => (
            <input
              {...control}
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Título, calle, zona o código"
              className={CLASE_CAMPO}
            />
          )}
        </Campo>
        <Campo etiqueta="Tipo">
          {(control) => (
            <select {...control} value={tipo} onChange={(e) => setTipo(e.target.value as TipoAfectacion | 'todos')} className={CLASE_CAMPO}>
              <option value="todos">Todos</option>
              {TIPOS_AFECTACION.map((t) => (
                <option key={t} value={t}>
                  {NOMBRE_TIPO[t]}
                </option>
              ))}
            </select>
          )}
        </Campo>
        <Campo etiqueta="Estado">
          {(control) => (
            <select {...control} value={estado} onChange={(e) => setEstado(e.target.value as Estado | 'todos')} className={CLASE_CAMPO}>
              <option value="todos">Todos</option>
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {NOMBRE_ESTADO[e]}
                </option>
              ))}
            </select>
          )}
        </Campo>
      </section>

      <p className="text-xs text-muted-foreground">
        Mostrando {filtradas.length} de {afectaciones.length} afectaciones.
      </p>

      {filtradas.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Ninguna afectación coincide con los filtros.
        </p>
      ) : (
        <>
          <ul className="flex flex-col gap-3 md:hidden" aria-label="Lista de afectaciones">
            {filtradas.map((a) => (
              <li key={a.id} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3">
                <Titulo afectacion={a} />
                <div className="flex flex-wrap items-center gap-2">
                  <InsigniaEstado estado={a.estado} />
                  <InsigniaPublicacion publicacion={a.publicacion} />
                </div>
                <Periodo afectacion={a} />
                <AccionesAfectacion afectacion={a} onMensaje={setMensaje} />
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto rounded-lg border border-border bg-card md:block">
            <table className="w-full min-w-[44rem] border-collapse text-left">
              <caption className="sr-only">Afectaciones registradas</caption>
              <thead className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="p-3 font-semibold">Afectación</th>
                  <th scope="col" className="p-3 font-semibold">Estado</th>
                  <th scope="col" className="p-3 font-semibold">Período</th>
                  <th scope="col" className="p-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((a) => (
                  <tr key={a.id} className="border-t border-border align-top">
                    <td className="max-w-xs p-3">
                      <Titulo afectacion={a} />
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col items-start gap-1.5">
                        <InsigniaEstado estado={a.estado} />
                        <InsigniaPublicacion publicacion={a.publicacion} />
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col gap-0.5">
                        <Periodo afectacion={a} />
                      </div>
                    </td>
                    <td className="p-3">
                      <AccionesAfectacion afectacion={a} onMensaje={setMensaje} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
