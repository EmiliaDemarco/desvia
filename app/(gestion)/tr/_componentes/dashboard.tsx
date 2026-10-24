'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AHORA_SIMULADO } from '@/lib/alerts/simulacion'
import { formatearFechaHora } from '@/lib/formato'
import { calcularMetricas } from '@/lib/metricas'
import { useDemoStore } from '@/lib/store'
import { EtiquetaSimulado } from './etiqueta-simulado'
import { GraficoPorDia, GraficoPorTipo } from './graficos'
import { MapaActivas } from './mapa-activas'

export function Dashboard() {
  const afectaciones = useDemoStore((s) => s.afectaciones)
  const notificaciones = useDemoStore((s) => s.notificaciones)
  const metricas = useMemo(() => calcularMetricas(afectaciones, notificaciones, AHORA_SIMULADO), [afectaciones, notificaciones])

  const kpis = [
    { etiqueta: 'Activas', valor: metricas.activas, detalle: 'En curso ahora' },
    { etiqueta: 'Programadas', valor: metricas.programadas, detalle: 'Con inicio futuro' },
    { etiqueta: 'Próximas a finalizar', valor: metricas.proximasAFinalizar, detalle: 'Fin estimado en menos de 24 h' },
    { etiqueta: 'Alertas generadas', valor: metricas.alertasGeneradas, detalle: 'Registradas en el centro de avisos' },
  ]

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 lg:p-8">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-balance text-2xl font-bold">Dashboard</h1>
          <EtiquetaSimulado />
        </div>
        <p className="text-pretty text-sm text-muted-foreground">
          Estado al {formatearFechaHora(AHORA_SIMULADO.toISOString())} (reloj de la demostración).
        </p>
      </header>

      <section aria-label="Indicadores" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.etiqueta} className="gap-1 py-4">
            <CardHeader className="px-4">
              <CardDescription className="text-xs font-semibold uppercase tracking-wide">{kpi.etiqueta}</CardDescription>
              <CardTitle className="text-4xl font-bold tabular-nums">{kpi.valor}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 text-xs leading-snug text-muted-foreground">{kpi.detalle}</CardContent>
          </Card>
        ))}
      </section>

      <section aria-label="Gráficos" className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle>Afectaciones por tipo</CardTitle>
              <EtiquetaSimulado />
            </div>
            <CardDescription>Registradas, sin contar las canceladas.</CardDescription>
          </CardHeader>
          <CardContent>
            <GraficoPorTipo datos={metricas.porTipo} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle>Afectaciones y alertas por día</CardTitle>
              <EtiquetaSimulado />
            </div>
            <CardDescription>Últimos 7 días, según fecha de inicio y de generación.</CardDescription>
          </CardHeader>
          <CardContent>
            <GraficoPorDia datos={metricas.porDia} />
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>Mapa de afectaciones activas</CardTitle>
            <EtiquetaSimulado />
          </div>
          <CardDescription>Tocá un marcador o un ítem de la lista para ver el detalle.</CardDescription>
        </CardHeader>
        <CardContent>
          <MapaActivas afectaciones={afectaciones} />
        </CardContent>
      </Card>

      <p className="text-pretty text-xs text-muted-foreground">Indicadores de la demostración. No son estadísticas oficiales.</p>
    </div>
  )
}
