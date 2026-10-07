'use client'

import { MapPin } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Field, SimpleSelect } from '@/components/shared/fields'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useApp } from '@/lib/store'
import type { EstadoMaquina, Maquina } from '@/lib/types'

const ESTADOS: EstadoMaquina[] = ['En Servicio', 'En Mantenimiento', 'Fuera de Servicio']

export function MaquinaDialog({
  open,
  maquina,
  onOpenChange,
}: {
  open: boolean
  maquina?: Maquina
  onOpenChange: (open: boolean) => void
}) {
  const { data, saveMaquina } = useApp()
  const [estado, setEstado] = useState<EstadoMaquina>(maquina?.estado ?? 'En Servicio')
  const [obraId, setObraId] = useState(maquina?.obraActualId != null ? String(maquina.obraActualId) : 'ninguna')

  const obrasDisponibles = data.obras.filter((o) => o.estado === 'Activa' || o.id === maquina?.obraActualId)
  const obraSeleccionada = data.obras.find((o) => String(o.id) === obraId)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    saveMaquina({
      id: maquina?.id,
      nombre: String(f.get('nombre')).trim(),
      marcaModelo: String(f.get('marca')).trim(),
      estado,
      obraActualId: obraId === 'ninguna' ? null : Number(obraId),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{maquina ? 'Editar máquina' : 'Nueva máquina'}</DialogTitle>
          <DialogDescription>Solo se pueden asignar obras activas.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Field label="Identificador / nombre" htmlFor="maq-nombre">
            <Input id="maq-nombre" name="nombre" required defaultValue={maquina?.nombre} />
          </Field>
          <Field label="Marca / modelo" htmlFor="maq-marca">
            <Input id="maq-marca" name="marca" defaultValue={maquina?.marcaModelo} />
          </Field>
          <Field label="Estado" htmlFor="maq-estado">
            <SimpleSelect
              id="maq-estado"
              value={estado}
              onValueChange={(v) => setEstado(v as EstadoMaquina)}
              items={ESTADOS.map((e) => ({ value: e, label: e }))}
            />
          </Field>
          <Field label="Obra asignada" htmlFor="maq-obra">
            <SimpleSelect
              id="maq-obra"
              value={obraId}
              onValueChange={setObraId}
              items={[
                { value: 'ninguna', label: 'Sin asignar (depósito)' },
                ...obrasDisponibles.map((o) => ({ value: String(o.id), label: o.nombre })),
              ]}
            />
          </Field>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden="true" />
            {obraSeleccionada?.direccion ?? 'En depósito'}
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
