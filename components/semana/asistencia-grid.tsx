'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DIAS_SEMANA, formatMoney, formatNumber } from '@/lib/format'
import { useApp } from '@/lib/store'
import type { ValorDia } from '@/lib/types'
import { cn } from '@/lib/utils'

const SIGUIENTE: Record<ValorDia, ValorDia> = { 1: 0.5, 0.5: 0, 0: 1 }
const ETIQUETA: Record<ValorDia, string> = { 1: 'Día completo', 0.5: 'Medio día', 0: 'Ausente' }

function CeldaDia({ valor, onClick, label }: { valor: ValorDia; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}: ${ETIQUETA[valor]}. Cambiar`}
      className={cn(
        'flex h-8 w-10 items-center justify-center rounded-md font-mono text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
        valor === 1 && 'bg-primary text-primary-foreground',
        valor === 0.5 && 'bg-chart-1/20 text-foreground',
        valor === 0 && 'bg-muted text-muted-foreground',
      )}
    >
      {valor === 0.5 ? '½' : valor}
    </button>
  )
}

export function AsistenciaGrid({ obraId }: { obraId: number }) {
  const { data, semana, setAsistenciaDia } = useApp()
  const modalidad = new Map(data.especialidades.map((e) => [e.id, e]))
  const personal = data.trabajadores.filter((t) => modalidad.get(t.especialidadId)?.modalidadPago === 'DIA')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asistencia diaria</CardTitle>
        <CardDescription>
          Tocá cada casilla para alternar entre 1 (día completo), ½ (medio día) y 0 (ausente).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trabajador</TableHead>
              {DIAS_SEMANA.map((d) => (
                <TableHead key={d} className="text-center">
                  {d}
                </TableHead>
              ))}
              <TableHead className="text-right">Asistidos</TableHead>
              <TableHead className="text-right">Faltas</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {personal.map((t) => {
              const registro = data.asistencias.find(
                (a) => a.obraId === obraId && a.trabajadorId === t.id && a.fechaSemana === semana,
              )
              const dias: ValorDia[] = registro?.dias ?? [0, 0, 0, 0, 0, 0]
              const asistidos = dias.reduce<number>((s, d) => s + d, 0)
              const tarifa = registro?.precioDiaAplicado ?? t.tarifaPersonal
              return (
                <TableRow key={t.id}>
                  <TableCell>
                    <p className="font-medium">{t.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {`${modalidad.get(t.especialidadId)?.nombre} · ${formatMoney(tarifa)}/día`}
                    </p>
                  </TableCell>
                  {dias.map((v, i) => (
                    <TableCell key={DIAS_SEMANA[i]} className="px-1">
                      <div className="flex justify-center">
                        <CeldaDia
                          valor={v}
                          label={`${t.nombre}, ${DIAS_SEMANA[i]}`}
                          onClick={() => setAsistenciaDia(obraId, t.id, i, SIGUIENTE[v])}
                        />
                      </div>
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-mono tabular-nums">{formatNumber(asistidos)}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-muted-foreground">
                    {formatNumber(dias.length - asistidos)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium tabular-nums">
                    {formatMoney(asistidos * tarifa)}
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
