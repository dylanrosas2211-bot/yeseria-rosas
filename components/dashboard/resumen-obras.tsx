'use client'

import { EstadoBadge } from '@/components/shared/estado-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { calcularBalance } from '@/lib/calculos'
import { formatM2, formatMoney } from '@/lib/format'
import { useApp } from '@/lib/store'
import { cn } from '@/lib/utils'

export function ResumenObras() {
  const { data, obraFiltro } = useApp()
  const obras = obraFiltro === 'todas' ? data.obras : data.obras.filter((o) => o.id === obraFiltro)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acumulado por obra</CardTitle>
        <CardDescription>Totales de todas las semanas registradas</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Obra</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Metros</TableHead>
              <TableHead className="text-right">Ingresos</TableHead>
              <TableHead className="text-right">Egresos</TableHead>
              <TableHead className="text-right">Ganancia limpia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {obras.map((obra) => {
              const b = calcularBalance(data, { obraId: obra.id })
              return (
                <TableRow key={obra.id}>
                  <TableCell className="font-medium">{obra.nombre}</TableCell>
                  <TableCell>
                    <EstadoBadge estado={obra.estado} />
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {formatM2(b.metrosOficiales + b.metrosContratista)}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{formatMoney(b.ingresos)}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{formatMoney(b.egresos)}</TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-mono font-semibold tabular-nums',
                      b.ganancia < 0 ? 'text-destructive' : 'text-positive',
                    )}
                  >
                    {formatMoney(b.ganancia)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
