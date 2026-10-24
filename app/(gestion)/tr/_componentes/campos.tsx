'use client'

import { useId, type ReactNode } from 'react'

export const CLASE_CAMPO =
  'min-h-11 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive'

interface PropsControl {
  id: string
  'aria-invalid': boolean | undefined
  'aria-describedby': string | undefined
}

interface CampoProps {
  etiqueta: string
  error?: string
  ayuda?: string
  obligatorio?: boolean
  className?: string
  children: (control: PropsControl) => ReactNode
}

export function Campo({ etiqueta, error, ayuda, obligatorio, className, children }: CampoProps) {
  const id = useId()
  const idMensaje = `${id}-mensaje`
  const mensaje = error ?? ayuda

  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className ?? ''}`}>
      <label htmlFor={id} className="text-sm font-semibold">
        {etiqueta}
        {obligatorio && (
          <>
            <span aria-hidden="true" className="text-destructive"> *</span>
            <span className="sr-only"> (obligatorio)</span>
          </>
        )}
      </label>
      {children({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': mensaje ? idMensaje : undefined })}
      {mensaje && (
        <p id={idMensaje} className={error ? 'text-sm font-medium text-destructive' : 'text-xs leading-relaxed text-muted-foreground'}>
          {mensaje}
        </p>
      )}
    </div>
  )
}
