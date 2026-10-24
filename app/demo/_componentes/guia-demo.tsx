import Link from 'next/link'
import { EstadoDatos } from './estado-datos'
import { PASOS } from './pasos'
import { ReinicioDemo } from './reinicio-demo'
import { TarjetaPaso } from './tarjeta-paso'

export function GuiaDemo() {
  return (
    <main className="min-h-dvh bg-[#e6ebf3] text-[#0f1b33]">
      <header className="bg-[#0f2a52] px-4 py-5 text-[#f3f5f9] sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          <nav aria-label="Otras vistas" className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
            <Link href="/demo/split" className="underline decoration-[#F26B1D] underline-offset-4 hover:text-[#ffffff]">
              Ver panel y celular lado a lado
            </Link>
            <Link href="/evolucion" className="underline decoration-[#F26B1D] underline-offset-4 hover:text-[#ffffff]">
              Evolución con IA
            </Link>
            <Link href="/" className="underline decoration-[#F26B1D] underline-offset-4 hover:text-[#ffffff]">
              Portada
            </Link>
          </nav>
          <div>
            <h1 className="text-balance text-2xl font-black tracking-tight sm:text-3xl">
              Guía de la demostración
            </h1>
            <p className="mt-1 text-pretty text-sm leading-relaxed text-[#c9d4e6] sm:text-base">
              Seis pasos para recorrer desv<span className="text-[#F26B1D]">IA</span> de punta a punta. Todos los datos son simulados.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6">
        <EstadoDatos />

        <ol className="flex flex-col gap-3" aria-label="Pasos de la demostración">
          {PASOS.map((paso, indice) => (
            <TarjetaPaso key={paso.id} paso={paso} numero={indice + 1} />
          ))}
        </ol>

        <ReinicioDemo />

        <p className="text-xs leading-relaxed text-[#4b5870]">
          Para ver los dos lados a la vez, usá la vista lado a lado: lo que publica el operador aparece al instante en el celular.
        </p>
      </div>
    </main>
  )
}
