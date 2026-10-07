'use client'

import { useState, type FormEvent } from 'react'
import { Field, SimpleSelect } from '@/components/shared/fields'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useApp } from '@/lib/store'
import type { EstadoObra, Obra } from '@/lib/types'

const ESTADOS: EstadoObra[] = ['Activa', 'Pausada', 'Finalizada']

export function ObraDialog({
  open,
  obra,
  onOpenChange,
}: {
  open: boolean
  obra?: Obra
  onOpenChange: (open: boolean) => void
}) {
  const { saveObra } = useApp()
  const [estado, setEstado] = useState<EstadoObra>(obra?.estado ?? 'Activa')

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const precio = Number(f.get('precio'))
    if (!(precio > 0)) return
    saveObra({
      id: obra?.id,
      nombre: String(f.get('nombre')).trim(),
      direccion: String(f.get('direccion')).trim(),
      nombreResponsable: String(f.get('responsable')).trim(),
      telefonoResponsable: String(f.get('telefono')).trim(),
      precioMetroCliente: precio,
      estado,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{obra ? 'Editar obra' : 'Nueva obra'}</DialogTitle>
          <DialogDescription>La dirección se usa como ubicación de las máquinas asignadas.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Nombre de la obra" htmlFor="obra-nombre">
              <Input id="obra-nombre" name="nombre" required defaultValue={obra?.nombre} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Dirección" htmlFor="obra-direccion">
              <Input id="obra-direccion" name="direccion" required defaultValue={obra?.direccion} />
            </Field>
          </div>
          <Field label="Arquitecto / responsable" htmlFor="obra-responsable">
            <Input id="obra-responsable" name="responsable" defaultValue={obra?.nombreResponsable} />
          </Field>
          <Field label="Teléfono" htmlFor="obra-telefono">
            <Input id="obra-telefono" name="telefono" type="tel" defaultValue={obra?.telefonoResponsable} placeholder="+54 9 11 ..." />
          </Field>
          <Field label="Precio m² al cliente" htmlFor="obra-precio">
            <Input id="obra-precio" name="precio" type="number" min={1} required defaultValue={obra?.precioMetroCliente} />
          </Field>
          <Field label="Estado" htmlFor="obra-estado">
            <SimpleSelect
              id="obra-estado"
              value={estado}
              onValueChange={(v) => setEstado(v as EstadoObra)}
              items={ESTADOS.map((e) => ({ value: e, label: e }))}
            />
          </Field>
          <DialogFooter className="sm:col-span-2">
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
