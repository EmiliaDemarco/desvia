'use client'

import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { SEGUNDOS_GRAFICO, type MuestraCola, type Umbrales } from '@/lib/laboratorio/nivel'

const config = {
  conteo: { label: 'Vehículos en la zona', color: 'var(--chart-2)' },
  promedio: { label: 'Promedio último minuto', color: 'var(--chart-1)' },
} satisfies ChartConfig

const MARCAS = [-120, -90, -60, -30, 0]

export function GraficoCola({ serie, umbrales }: { serie: MuestraCola[]; umbrales: Umbrales }) {
  if (serie.length === 0) {
    return (
      <p className="flex h-56 items-center justify-center rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
        Reproducí el video para empezar a medir. El gráfico muestra los últimos 2 minutos.
      </p>
    )
  }

  const datos = serie.map((muestra, indice) => ({
    segundo: indice - (serie.length - 1),
    conteo: muestra.conteo,
    promedio: Number(muestra.promedio.toFixed(1)),
  }))

  return (
    <figure className="flex flex-col gap-2">
      <ChartContainer config={config} className="h-56 w-full">
        <LineChart accessibilityLayer data={datos} margin={{ left: 0, right: 12, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="segundo"
            type="number"
            domain={[-SEGUNDOS_GRAFICO, 0]}
            ticks={MARCAS}
            tickFormatter={(valor: number) => (valor === 0 ? 'ahora' : `${valor} s`)}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            allowDecimals={false}
            width={28}
            tickLine={false}
            axisLine={false}
            domain={[0, (maximo: number) => Math.max(Math.ceil(umbrales.congestionado * 1.5), Math.ceil(maximo))]}
          />
          <ReferenceLine y={umbrales.moderado} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
          <ReferenceLine y={umbrales.congestionado} stroke="var(--destructive)" strokeDasharray="4 4" />
          <ChartTooltip content={<ChartTooltipContent labelFormatter={(_, items) => `Hace ${Math.abs(items?.[0]?.payload?.segundo ?? 0)} s`} />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line dataKey="conteo" type="stepAfter" stroke="var(--color-conteo)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
          <Line dataKey="promedio" type="monotone" stroke="var(--color-promedio)" strokeWidth={2.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ChartContainer>
      <figcaption className="text-xs text-muted-foreground">
        Líneas punteadas: umbral moderado ({umbrales.moderado}) y congestionado ({umbrales.congestionado}).
      </figcaption>
    </figure>
  )
}
