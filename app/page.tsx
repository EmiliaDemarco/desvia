import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <section className="w-full max-w-2xl space-y-10 text-center">
        <header className="space-y-3">
          <p className="text-5xl font-black tracking-tight text-foreground">desv<span className="text-[#F26B1D]">IA</span></p>
          <p className="text-lg text-muted-foreground">La ciudad te avisa antes.</p>
          <p className="mx-auto w-fit rounded-full border border-amber-500/40 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">DATO SIMULADO · Fase 1A</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/movil/desvia" className="rounded-xl border border-border bg-card p-6 text-left shadow-sm transition hover:border-[#F26B1D]">
            <span className="text-sm font-semibold text-muted-foreground">Acceso ciudadano</span>
            <h1 className="mt-2 text-xl font-bold text-foreground">Experiencia ciudadana</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">TR-Móvil + desvIA para consultar afectaciones de la ciudad.</p>
          </Link>
          <Link href="/tr" className="rounded-xl border border-border bg-card p-6 text-left shadow-sm transition hover:border-[#F26B1D]">
            <span className="text-sm font-semibold text-muted-foreground">Acceso gestión</span>
            <h1 className="mt-2 text-xl font-bold text-foreground">Panel municipal desvIA TR</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Espacio de gestión y revisión de información simulada.</p>
          </Link>
        </div>
        <Link href="/demo/split" className="inline-block rounded-xl border border-dashed border-[#F26B1D] px-5 py-3 text-sm font-bold text-foreground transition hover:bg-amber-50">
          Ver los dos lados en vivo (panel + celular)
        </Link>
      </section>
    </main>
  )
}
