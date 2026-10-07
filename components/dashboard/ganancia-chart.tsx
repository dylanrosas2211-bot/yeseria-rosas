'use client'

import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { serieSemanal } from '@/lib/calculos'
import { formatCompact, formatFechaCorta, formatMoney } from '@/lib/format'
import { useApp } from '@/lib/store'

const chartConfig = {
  ganancia: { label: 'Ganancia limpia', color: 'var(--chart-1)' },
  ingresos: { label: 'Ingresos', color: 'var(--chart-2)' },
  egresos: { label: 'Egresos', color: 'var(--chart-3)' },
} satisfies ChartConfig

export function GananciaChart() {
  const { data, obraFiltro, semanas, semana } = useApp()
  const serie = serieSemanal(data, obraFiltro, semanas)
  const nombreObra =
    obraFiltro === 'todas' ? 'Todas las obras consolidadas' : data.obras.find((o) => o.id === obraFiltro)?.nombre

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Tendencia de ganancia limpia</CardTitle>
        <CardDescription>{`${nombreObra} · semana a semana`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <LineChart data={serie} margin={{ left: 4, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickFormatter={formatCompact} tickLine={false} axisLine={false} width={60} />
            <ReferenceLine y={0} stroke="var(--border)" />
            <ReferenceLine x={formatFechaCorta(semana)} stroke="var(--chart-1)" strokeOpacity={0.35} strokeDasharray="3 3" />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, item) => (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="size-2 rounded-full" style={{ background: item.color }} />
                        {chartConfig[name as keyof typeof chartConfig]?.label ?? name}
                      </span>
                      <span className="font-mono font-medium tabular-nums text-foreground">
                        {formatMoney(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line isAnimationActive={false} dataKey="ingresos" type="monotone" stroke="var(--color-ingresos)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            <Line isAnimationActive={false} dataKey="egresos" type="monotone" stroke="var(--color-egresos)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            <Line isAnimationActive={false}
              dataKey="ganancia"
              type="monotone"
              stroke="var(--color-ganancia)"
              strokeWidth={3}
              dot={{ r: 3, fill: 'var(--color-ganancia)' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
