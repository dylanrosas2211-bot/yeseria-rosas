'use client'

import { BalanceDesglose } from './balance-desglose'
import { GananciaChart } from './ganancia-chart'
import { KpiCards } from './kpi-cards'
import { ResumenObras } from './resumen-obras'

export function DashboardPanel() {
  return (
    <div className="flex flex-col gap-6">
      <KpiCards />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GananciaChart />
        </div>
        <BalanceDesglose />
      </div>
      <ResumenObras />
    </div>
  )
}
