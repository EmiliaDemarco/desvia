'use client'

import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDemoStore } from '@/lib/store'
import type { UsuarioDemo } from '@/lib/types'
import { EtiquetaSimulado } from './etiqueta-simulado'

const OPERADOR_DEMO: UsuarioDemo = { id: 'usr-operador-demo', nombre: 'Operador Demo', rol: 'Operador de gestión', esDatoSimulado: true }

export function LoginDemo() {
  const setUsuarioActual = useDemoStore((s) => s.setUsuarioActual)

  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto p-4">
      <section aria-labelledby="titulo-login" className="flex w-full max-w-md flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ShieldCheck className="size-6" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 id="titulo-login" className="text-balance text-2xl font-bold">desvIA TR</h1>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            Acceso de demostración. No hay credenciales reales: la cuenta es simulada y se guarda solo en este navegador.
          </p>
        </div>
        <Button size="lg" className="h-auto w-full whitespace-normal py-3 text-base" onClick={() => setUsuarioActual(OPERADOR_DEMO)}>
          Ingresar como Operador Demo (cuenta simulada)
        </Button>
        <EtiquetaSimulado />
      </section>
    </div>
  )
}
