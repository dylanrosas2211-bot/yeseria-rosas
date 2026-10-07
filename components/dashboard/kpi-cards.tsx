'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { calcularBalance } from '@/lib/calculos'
import { formatMoney, formatRangoSemana } from '@/lib/format'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'

export function KpiCards() {
  const { data, obraFiltro, semana, semanas } = useApp()
  const actual = calcularBalance(data, { obraId: obraFiltro, semana })
  const idx = semanas.indexOf(semana)
  const previa = idx > 0 ? calcularBalance(data, { obraId: obraFiltro, semana: semanas[idx - 1] }) : null
  const acumulado = calcularBalance(data, { obraId: obraFiltro })

  const delta =
    previa && previa.ganancia !== 0 ? ((actual.ganancia - previa.ganancia) / Math.abs(previa.ganancia)) * 100 : null

  const items = [
    { label: 'Ingresos de la semana', value: actual.ingresos, hint: `${formatRangoSemana(semana)}` },
    { label: 'Egresos de personal', value: actual.egresos, hint: `${actual.diasTotales} jornales · m² oficiales` },
    { label: 'Ganancia limpia', value: actual.ganancia, hint: null, destacado: true },
    { label: 'Ganancia acumulada', value: acumulado.ganancia, hint: `${semanas.length} semanas registradas` },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className={cn(item.destacado && 'bg-primary text-primary-foreground ring-0')}>
          <CardContent className="flex flex-col gap-1">
            <p className={cn('text-xs font-medium', item.destacado ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
              {item.label}
            </p>
            <p
              className={cn(
                'font-mono text-xl font-semibold tabular-nums tracking-tight md:text-2xl',
                !item.destacado && item.value < 0 && 'text-destructive',
              )}
            >
              {formatMoney(item.value)}
            </p>
            {item.destacado ? (
              <p className="flex items-center gap-1 text-xs text-primary-foreground/80">
                {delta == null ? (
                  'Sin semana previa'
                ) : (
                  <>
                    {delta >= 0 ? (
                      <TrendingUp className="size-3.5 text-chart-1" aria-hidden="true" />
                    ) : (
                      <TrendingDown className="size-3.5 text-chart-1" aria-hidden="true" />
                    )}
                    {`${delta >= 0 ? '+' : ''}${delta.toFixed(1)}% vs. semana anterior`}
                  </>
                )}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">{item.hint}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
