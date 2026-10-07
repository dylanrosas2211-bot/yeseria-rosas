'use client'

import { EmptyState } from '@/components/shared/fields'
import { formatRangoSemana } from '@/lib/format'
import { useApp } from '@/lib/store'
import { AdelantosCard } from './adelantos-card'
import { AsistenciaGrid } from './asistencia-grid'
import { LiquidacionTable } from './liquidacion-table'
import { ProduccionGrid } from './produccion-grid'

export function SemanaPanel() {
  const { data, obraFiltro, semana } = useApp()
  const obra = obraFiltro === 'todas' ? null : data.obras.find((o) => o.id === obraFiltro)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-balance">
          {`Semana ${formatRangoSemana(semana)}`}
        </h1>
        <p className="text-sm text-muted-foreground">
          {obra ? `${obra.nombre} · ${obra.direccion}` : 'Liquidación consolidada de todas las obras'}
        </p>
      </div>

      {obra ? (
        <>
          <AsistenciaGrid obraId={obra.id} />
          <div className="grid gap-6 lg:grid-cols-2">
            <ProduccionGrid obraId={obra.id} precioCliente={obra.precioMetroCliente} />
            <AdelantosCard obraId={obra.id} />
          </div>
        </>
      ) : (
        <EmptyState>
          Seleccioná una obra en el encabezado para cargar asistencia, metros y adelantos.
        </EmptyState>
      )}

      <LiquidacionTable />
    </div>
  )
}
