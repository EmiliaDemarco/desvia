'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CircleCheck, CircleX, Megaphone, Pencil } from 'lucide-react'
import { cancelarAfectacion, publicarAfectacion, resolverAfectacion } from '@/lib/services/afectaciones'
import type { Afectacion } from '@/lib/types'

type Pendiente = 'resolver' | 'cancelar' | null

const CLASE_BOTON =
  'inline-flex min-h-10 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-xs font-semibold text-foreground outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring'

const TEXTOS_CONFIRMACION = {
  resolver: {
    titulo: 'Resolver afectación',
    descripcion: 'Pasará a estado Resuelta y dejará de contar como activa. El cambio queda registrado en el historial.',
    boton: 'Resolver',
  },
  cancelar: {
    titulo: 'Cancelar afectación',
    descripcion: 'Pasará a estado Cancelada. El cambio queda registrado en el historial.',
    boton: 'Cancelar afectación',
  },
} as const

interface AccionesAfectacionProps {
  afectacion: Afectacion
  onMensaje: (mensaje: string) => void
}

export function AccionesAfectacion({ afectacion, onMensaje }: AccionesAfectacionProps) {
  const [pendiente, setPendiente] = useState<Pendiente>(null)
  const abierta = afectacion.estado === 'activa' || afectacion.estado === 'programada'
  const puedePublicar = abierta && afectacion.publicacion !== 'publicada'

  async function publicar() {
    const actualizada = await publicarAfectacion(afectacion.id)
    if (actualizada) onMensaje(`«${actualizada.titulo}» quedó publicada para la ciudadanía.`)
  }

  async function confirmar() {
    const accion = pendiente
    setPendiente(null)
    if (accion === 'resolver') {
      const actualizada = await resolverAfectacion(afectacion.id)
      if (actualizada) onMensaje(`«${actualizada.titulo}» marcada como resuelta.`)
    }
    if (accion === 'cancelar') {
      const actualizada = await cancelarAfectacion(afectacion.id)
      if (actualizada) onMensaje(`«${actualizada.titulo}» cancelada.`)
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Link href={`/tr/afectaciones/${afectacion.id}/editar`} className={CLASE_BOTON}>
          <Pencil className="size-3.5" aria-hidden="true" />
          Editar<span className="sr-only"> {afectacion.titulo}</span>
        </Link>
        {puedePublicar && (
          <button type="button" onClick={publicar} className={CLASE_BOTON}>
            <Megaphone className="size-3.5" aria-hidden="true" />
            Publicar<span className="sr-only"> {afectacion.titulo}</span>
          </button>
        )}
        {abierta && (
          <button type="button" onClick={() => setPendiente('resolver')} className={CLASE_BOTON}>
            <CircleCheck className="size-3.5" aria-hidden="true" />
            Resolver<span className="sr-only"> {afectacion.titulo}</span>
          </button>
        )}
        {abierta && (
          <button type="button" onClick={() => setPendiente('cancelar')} className={`${CLASE_BOTON} text-destructive`}>
            <CircleX className="size-3.5" aria-hidden="true" />
            Cancelar<span className="sr-only"> {afectacion.titulo}</span>
          </button>
        )}
      </div>

      {pendiente && (
        <dialog
          ref={(dialogo) => {
            if (dialogo && !dialogo.open) dialogo.showModal()
          }}
          onClose={() => setPendiente(null)}
          aria-labelledby={`confirmar-${afectacion.id}`}
          className="m-auto w-[min(92vw,26rem)] rounded-lg border border-border bg-card p-5 text-card-foreground backdrop:bg-foreground/40"
        >
          <form method="dialog" className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h2 id={`confirmar-${afectacion.id}`} className="text-lg font-bold">
                {TEXTOS_CONFIRMACION[pendiente].titulo}
              </h2>
              <p className="text-sm font-medium">«{afectacion.titulo}»</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{TEXTOS_CONFIRMACION[pendiente].descripcion}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button type="submit" className={CLASE_BOTON}>
                Volver
              </button>
              <button
                type="button"
                onClick={confirmar}
                className={`inline-flex min-h-10 items-center rounded-md px-3 text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  pendiente === 'cancelar' ? 'bg-destructive text-primary-foreground' : 'bg-primary text-primary-foreground'
                }`}
              >
                {TEXTOS_CONFIRMACION[pendiente].boton}
              </button>
            </div>
          </form>
        </dialog>
      )}
    </>
  )
}
