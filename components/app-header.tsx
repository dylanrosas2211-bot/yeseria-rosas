'use client'

import { PaintRoller } from 'lucide-react'
import { SimpleSelect } from '@/components/shared/fields'
import { formatRangoSemana } from '@/lib/format'
import { useApp } from '@/lib/store'

export function AppHeader() {
  const { data, obraFiltro, setObraFiltro, semana, setSemana, semanas } = useApp()

  const obraItems = [
    { value: 'todas', label: 'Todas las obras' },
    ...data.obras.map((o) => ({ value: String(o.id), label: o.nombre })),
  ]
  const semanaItems = [...semanas].reverse().map((s) => ({ value: s, label: `Semana ${formatRangoSemana(s)}` }))

  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <PaintRoller className="size-5" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <p className="font-semibold tracking-tight">YesoControl</p>
            <p className="text-xs text-muted-foreground">Gestión multiobra · yeso proyectado</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 md:flex md:w-auto">
          <SimpleSelect
            ariaLabel="Obra seleccionada"
            value={String(obraFiltro)}
            onValueChange={(v) => setObraFiltro(v === 'todas' ? 'todas' : Number(v))}
            items={obraItems}
            className="md:w-64"
          />
          <SimpleSelect
            ariaLabel="Semana seleccionada"
            value={semana}
            onValueChange={setSemana}
            items={semanaItems}
            className="md:w-52"
          />
        </div>
      </div>
    </header>
  )
}
