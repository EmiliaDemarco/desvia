'use client'

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import type { Metricas } from '@/lib/metricas'

const configBarras = {
  cantidad: { label: 'Afectaciones', color: 'var(--chart-1)' },
} satisfies ChartConfig

const configLinea = {
  afectaciones: { label: 'Afectaciones', color: 'var(--chart-1)' },
  alertas: { label: 'Alertas', color: 'var(--chart-2)' },
} satisfies ChartConfig

export function GraficoPorTipo({ datos }: { datos: Metricas['porTipo'] }) {
  return (
    <figure className="flex flex-col gap-2">
      <ChartContainer config={configBarras} className="h-64 w-full">
        <BarChart accessibilityLayer data={datos} layout="vertical" margin={{ left: 0, right: 16 }}>
          <CartesianGrid horizontal={false} />
          <YAxis dataKey="etiqueta" type="category" tickLine={false} axisLine={false} width={86} />
          <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="cantidad" fill="var(--color-cantidad)" radius={4} />
        </BarChart>
      </ChartContainer>
      <figcaption className="sr-only">
        Afectaciones por tipo: {datos.map((d) => `${d.etiqueta} ${d.cantidad}`).join(', ')}.
      </figcaption>
    </figure>
  )
}

export function GraficoPorDia({ datos }: { datos: Metricas['porDia'] }) {
  return (
    <figure className="flex flex-col gap-2">
      <ChartContainer config={configLinea} className="h-64 w-full">
        <LineChart accessibilityLayer data={datos} margin={{ left: 0, right: 12, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="dia" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis allowDecimals={false} width={28} tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line dataKey="afectaciones" type="monotone" stroke="var(--color-afectaciones)" strokeWidth={2} dot={{ r: 3 }} />
          <Line dataKey="alertas" type="monotone" stroke="var(--color-alertas)" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ChartContainer>
      <figcaption className="sr-only">
        Afectaciones y alertas de los últimos 7 días: {datos.map((d) => `${d.dia}, ${d.afectaciones} afectaciones y ${d.alertas} alertas`).join('; ')}.
      </figcaption>
    </figure>
  )
}
