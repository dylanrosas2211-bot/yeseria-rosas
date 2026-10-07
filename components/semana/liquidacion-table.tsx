'use client'

import { EmptyState } from '@/components/shared/fields'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { calcularLiquidacion } from '@/lib/calculos'
import { formatM2, formatMoney, formatNumber } from '@/lib/format'
import { useApp } from '@/lib/store'

export function LiquidacionTable() {
  const { data, obraFiltro, semana } = useApp()
  const filas = calcularLiquidacion(data, { obraId: obraFiltro, semana })
  const totales = filas.reduce(
    (t, f) => ({ bruto: t.bruto + f.bruto, adelantos: t.adelantos + f.adelantos, saldo: t.saldo + f.saldo }),
    { bruto: 0, adelantos: 0, saldo: 0 },
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liquidación semanal</CardTitle>
        <CardDescription>Bruto ganado menos vales y adelantos = saldo a pagar</CardDescription>
      </CardHeader>
      <CardContent>
        {filas.length === 0 ? (
          <EmptyState>No hay registros de personal para esta semana.</EmptyState>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trabajador</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead className="text-right">Producción</TableHead>
                <TableHead className="text-right">Bruto</TableHead>
                <TableHead className="text-right">Adelantos</TableHead>
                <TableHead className="text-right">Saldo a pagar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filas.map((f) => (
                <TableRow key={f.trabajador.id}>
                  <TableCell className="font-medium">{f.trabajador.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">{f.especialidad}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {f.modalidad === 'METRO' ? formatM2(f.cantidad) : `${formatNumber(f.cantidad)} días`}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{formatMoney(f.bruto)}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-muted-foreground">
                    {f.adelantos ? `− ${formatMoney(f.adelantos)}` : '—'}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold tabular-nums">
                    {formatMoney(f.saldo)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Totales</TableCell>
                <TableCell className="text-right font-mono tabular-nums">{formatMoney(totales.bruto)}</TableCell>
                <TableCell className="text-right font-mono tabular-nums">{`− ${formatMoney(totales.adelantos)}`}</TableCell>
                <TableCell className="text-right font-mono tabular-nums">{formatMoney(totales.saldo)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
