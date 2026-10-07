'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { calcularBalance } from '@/lib/calculos'
import { formatM2, formatMoney, formatRangoSemana } from '@/lib/format'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'

function Fila({ label, value, fuerte, negativo }: { label: string; value: string; fuerte?: boolean; negativo?: boolean }) {
  return (
    <div className={cn('flex items-baseline justify-between gap-3 py-1.5 text-sm', fuerte && 'font-semibold')}>
      <dt className={cn(!fuerte && 'text-muted-foreground')}>{label}</dt>
      <dd className={cn('font-mono tabular-nums', negativo && 'text-destructive')}>{value}</dd>
    </div>
  )
}

export function BalanceDesglose() {
  const { data, obraFiltro, semana } = useApp()
  const b = calcularBalance(data, { obraId: obraFiltro, semana })

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Balance de la semana</CardTitle>
        <CardDescription>{formatRangoSemana(semana)}</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="divide-y">
          <div className="pb-2">
            <Fila label="Metros oficiales" value={formatM2(b.metrosOficiales)} />
            <Fila label="Metros propios" value={formatM2(b.metrosContratista)} />
            <Fila label="Ingresos" value={formatMoney(b.ingresos)} fuerte />
          </div>
          <div className="py-2">
            <Fila label="Pago por m²" value={formatMoney(b.costoMetros)} />
            <Fila label={`Pago por día (${b.diasTotales} jornales)`} value={formatMoney(b.costoDias)} />
            <Fila label="Egresos de personal" value={formatMoney(b.egresos)} fuerte />
          </div>
          <div className="py-2">
            <Fila label="Ganancia limpia" value={formatMoney(b.ganancia)} fuerte negativo={b.ganancia < 0} />
          </div>
          <div className="pt-2">
            <Fila label="Adelantos entregados" value={`− ${formatMoney(b.adelantos)}`} />
            <Fila label="Saldo a pagar al personal" value={formatMoney(b.saldoAPagar)} />
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
