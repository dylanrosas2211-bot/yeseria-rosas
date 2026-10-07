'use client'

import { Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { EmptyState, Field, SimpleSelect } from '@/components/shared/fields'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { addDays, formatFechaCorta, formatMoney, semanaDe } from '@/lib/format'
import { useApp } from '@/lib/store'

export function AdelantosCard({ obraId }: { obraId: number }) {
  const { data, semana, addAdelanto, deleteAdelanto } = useApp()
  const [trabajadorId, setTrabajadorId] = useState(String(data.trabajadores[0]?.id ?? ''))

  const adelantos = data.adelantos
    .filter((a) => a.obraId === obraId && semanaDe(a.fecha) === semana)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
  const total = adelantos.reduce((s, a) => s + a.monto, 0)
  const nombre = (id: number) => data.trabajadores.find((t) => t.id === id)?.nombre ?? '—'

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const monto = Number(form.get('monto'))
    const fecha = String(form.get('fecha'))
    if (!trabajadorId || !(monto > 0) || !fecha) return
    addAdelanto({
      obraId,
      trabajadorId: Number(trabajadorId),
      fecha,
      monto,
      concepto: String(form.get('concepto') || 'Adelanto semanal'),
    })
    e.currentTarget.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vales y adelantos</CardTitle>
        <CardDescription>{`Total entregado: ${formatMoney(total)}`}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-3" key={semana}>
          <div className="col-span-2">
            <Field label="Trabajador" htmlFor="adelanto-trabajador">
              <SimpleSelect
                id="adelanto-trabajador"
                value={trabajadorId}
                onValueChange={setTrabajadorId}
                items={data.trabajadores.map((t) => ({ value: String(t.id), label: t.nombre }))}
              />
            </Field>
          </div>
          <Field label="Monto" htmlFor="adelanto-monto">
            <Input id="adelanto-monto" name="monto" type="number" min={1} step={500} required placeholder="20000" />
          </Field>
          <Field label="Fecha" htmlFor="adelanto-fecha">
            <Input
              id="adelanto-fecha"
              name="fecha"
              type="date"
              required
              defaultValue={semana}
              min={semana}
              max={addDays(semana, 6)}
            />
          </Field>
          <div className="col-span-2 flex items-end gap-2">
            <div className="flex-1">
              <Field label="Concepto" htmlFor="adelanto-concepto">
                <Input id="adelanto-concepto" name="concepto" placeholder="Adelanto semanal" />
              </Field>
            </div>
            <Button type="submit">Registrar</Button>
          </div>
        </form>

        {adelantos.length === 0 ? (
          <EmptyState>Sin adelantos esta semana.</EmptyState>
        ) : (
          <ul className="divide-y rounded-lg border">
            {adelantos.map((a) => (
              <li key={a.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{nombre(a.trabajadorId)}</p>
                  <p className="text-xs text-muted-foreground">{`${formatFechaCorta(a.fecha)} · ${a.concepto}`}</p>
                </div>
                <span className="font-mono tabular-nums">{formatMoney(a.monto)}</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => deleteAdelanto(a.id)}
                  aria-label={`Eliminar adelanto de ${nombre(a.trabajadorId)}`}
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
