'use client'

import { useMemo, useState } from 'react'
import { useDemoStore } from '@/lib/store'
import { useHidratado } from '@/lib/use-hidratado'
import { Campo, CLASE_CAMPO } from './campos'
import { EtiquetaSimulado } from './etiqueta-simulado'
import { HistorialLista } from './historial-lista'
import { EsqueletoCarga } from './no-encontrada'

const normalizar = (texto: string) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export function HistorialGlobal() {
  const hidratado = useHidratado()
  const historial = useDemoStore((s) => s.historial)
  const afectaciones = useDemoStore((s) => s.afectaciones)
  const [busqueda, setBusqueda] = useState('')
  const [accion, setAccion] = useState('todas')

  const titulos = useMemo(() => Object.fromEntries(afectaciones.map((a) => [a.id, a.titulo])), [afectaciones])
  const acciones = useMemo(() => [...new Set(historial.map((c) => c.accion))].sort(), [historial])

  const visibles = useMemo(() => {
    const termino = normalizar(busqueda.trim())
    return [...historial]
      .filter((c) => accion === 'todas' || c.accion === accion)
      .filter((c) => !termino || normalizar(`${titulos[c.entidadId] ?? ''} ${c.usuario} ${c.campo ?? ''} ${c.valorAnterior ?? ''} ${c.valorNuevo ?? ''} ${c.detalle}`).includes(termino))
      .sort((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha))
  }, [historial, busqueda, accion, titulos])

  if (!hidratado) return <EsqueletoCarga />

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 p-4 lg:p-8">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-balance text-2xl font-bold">Historial</h1>
          <EtiquetaSimulado />
        </div>
        <p className="text-pretty text-sm text-muted-foreground">
          Cada creación, edición o cambio de estado queda registrado con el usuario, la fecha y hora, el campo y los valores anterior y nuevo.
        </p>
      </header>

      <section aria-label="Filtros" className="grid gap-3 sm:grid-cols-[1fr_14rem]">
        <Campo etiqueta="Buscar">
          {(control) => (
            <input
              {...control}
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Afectación, usuario, campo o valor"
              className={CLASE_CAMPO}
            />
          )}
        </Campo>
        <Campo etiqueta="Tipo de cambio">
          {(control) => (
            <select {...control} value={accion} onChange={(e) => setAccion(e.target.value)} className={CLASE_CAMPO}>
              <option value="todas">Todos</option>
              {acciones.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          )}
        </Campo>
      </section>

      <p className="text-xs text-muted-foreground">
        Mostrando {visibles.length} de {historial.length} registros.
      </p>

      <HistorialLista
        cambios={visibles}
        titulos={titulos}
        vacio={historial.length === 0 ? 'Todavía no hay cambios. Creá, editá o publicá una afectación y aparecerá acá.' : 'Ningún registro coincide con los filtros.'}
      />
    </div>
  )
}
