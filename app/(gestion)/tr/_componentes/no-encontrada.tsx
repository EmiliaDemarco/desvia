import Link from 'next/link'

export function AfectacionNoEncontrada() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 p-4 lg:p-8">
      <h1 className="text-balance text-2xl font-bold">No encontramos esa afectación</h1>
      <p className="text-pretty text-sm text-muted-foreground">Puede que se haya reiniciado la demostración o que el enlace sea incorrecto.</p>
      <Link href="/tr/afectaciones" className="inline-flex min-h-11 w-fit items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        Volver a Afectaciones
      </Link>
    </div>
  )
}

export function EsqueletoCarga() {
  return <div className="mx-auto h-64 w-full max-w-3xl animate-pulse rounded-lg bg-muted" role="status" aria-label="Cargando" />
}
