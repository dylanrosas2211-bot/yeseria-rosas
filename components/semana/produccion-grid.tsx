'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatM2, formatMoney } from '@/lib/format'
import { useApp } from '@/lib/store'

function FilaMetros({
  id,
  nombre,
  detalle,
  metros,
  subtotal,
  onChange,
}: {
  id: string
  nombre: string
  detalle: string
  metros: number
  subtotal: string
  onChange: (m: number) => void
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="block truncate text-sm font-medium">
          {nombre}
        </label>
        <p className="truncate text-xs text-muted-foreground">{detalle}</p>
      </div>
      <div className="relative w-28">
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          step={0.5}
          value={metros || ''}
          placeholder="0"
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="pr-9 text-right font-mono tabular-nums"
        />
        <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-muted-foreground">
          m²
        </span>
      </div>
      <p className="w-28 text-right font-mono text-sm tabular-nums">{subtotal}</p>
    </div>
  )
}

export function ProduccionGrid({ obraId, precioCliente }: { obraId: number; precioCliente: number }) {
  const { data, semana, setMetros } = useApp()
  const especialidades = new Map(data.especialidades.map((e) => [e.id, e]))
  const oficiales = data.trabajadores.filter((t) => especialidades.get(t.especialidadId)?.modalidadPago === 'METRO')
  const registro = (trabajadorId: number | null) =>
    data.producciones.find((p) => p.obraId === obraId && p.trabajadorId === trabajadorId && p.fechaSemana === semana)

  const metrosPropios = registro(null)?.metrosCuadrados ?? 0
  const totalOficiales = oficiales.reduce((s, t) => s + (registro(t.id)?.metrosCuadrados ?? 0), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Producción por metros</CardTitle>
        <CardDescription>{`Precio al cliente: ${formatMoney(precioCliente)}/m²`}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="divide-y">
          {oficiales.map((t) => {
            const r = registro(t.id)
            const metros = r?.metrosCuadrados ?? 0
            const tarifa = r?.precioMetroAplicado ?? t.tarifaPersonal
            return (
              <FilaMetros
                key={t.id}
                id={`metros-${t.id}`}
                nombre={t.nombre}
                detalle={`${especialidades.get(t.especialidadId)?.nombre} · ${formatMoney(tarifa)}/m²`}
                metros={metros}
                subtotal={formatMoney(metros * tarifa)}
                onChange={(m) => setMetros(obraId, t.id, m)}
              />
            )
          })}
        </div>
        <div className="mt-2 rounded-lg bg-chart-1/10 px-3">
          <FilaMetros
            id="metros-contratista"
            nombre="Metros propios del contratista"
            detalle="Sin costo de mano de obra"
            metros={metrosPropios}
            subtotal="—"
            onChange={(m) => setMetros(obraId, null, m)}
          />
        </div>
        <div className="mt-3 flex items-center justify-between border-t pt-3 text-sm">
          <span className="text-muted-foreground">
            {`Total: ${formatM2(totalOficiales + metrosPropios)}`}
          </span>
          <span className="font-mono font-semibold tabular-nums">
            {`Ingreso ${formatMoney((totalOficiales + metrosPropios) * precioCliente)}`}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
