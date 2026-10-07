'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { Field, SimpleSelect } from '@/components/shared/fields'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useApp } from '@/lib/store'
import type { Especialidad, ModalidadPago, Trabajador } from '@/lib/types'

interface DialogProps<T> {
  open: boolean
  item?: T
  onOpenChange: (open: boolean) => void
}

function FormDialog({
  open,
  onOpenChange,
  title,
  onSubmit,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  onSubmit: (f: FormData) => boolean
  children: ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            if (onSubmit(new FormData(e.currentTarget))) onOpenChange(false)
          }}
        >
          {children}
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

export function EspecialidadDialog({ open, item, onOpenChange }: DialogProps<Especialidad>) {
  const { saveEspecialidad } = useApp()
  const [modalidad, setModalidad] = useState<ModalidadPago>(item?.modalidadPago ?? 'DIA')

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={item ? 'Editar especialidad' : 'Nueva especialidad'}
      onSubmit={(f) => {
        saveEspecialidad({ id: item?.id, nombre: String(f.get('nombre')).trim(), modalidadPago: modalidad })
        return true
      }}
    >
      <Field label="Nombre del cargo" htmlFor="esp-nombre">
        <Input id="esp-nombre" name="nombre" required defaultValue={item?.nombre} placeholder="Oficial, Ayudante..." />
      </Field>
      <Field label="Modalidad de cobro" htmlFor="esp-modalidad">
        <SimpleSelect
          id="esp-modalidad"
          value={modalidad}
          onValueChange={(v) => setModalidad(v as ModalidadPago)}
          items={[
            { value: 'DIA', label: 'Por día' },
            { value: 'METRO', label: 'Por m²' },
          ]}
        />
      </Field>
    </FormDialog>
  )
}

export function TrabajadorDialog({ open, item, onOpenChange }: DialogProps<Trabajador>) {
  const { data, saveTrabajador } = useApp()
  const [especialidadId, setEspecialidadId] = useState(
    String(item?.especialidadId ?? data.especialidades[0]?.id ?? ''),
  )
  const modalidad = data.especialidades.find((e) => String(e.id) === especialidadId)?.modalidadPago

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={item ? 'Editar trabajador' : 'Nuevo trabajador'}
      onSubmit={(f) => {
        const tarifa = Number(f.get('tarifa'))
        if (!especialidadId || !(tarifa > 0)) return false
        saveTrabajador({
          id: item?.id,
          nombre: String(f.get('nombre')).trim(),
          especialidadId: Number(especialidadId),
          tarifaPersonal: tarifa,
        })
        return true
      }}
    >
      <Field label="Nombre completo" htmlFor="trab-nombre">
        <Input id="trab-nombre" name="nombre" required defaultValue={item?.nombre} />
      </Field>
      <Field label="Especialidad" htmlFor="trab-esp">
        <SimpleSelect
          id="trab-esp"
          value={especialidadId}
          onValueChange={setEspecialidadId}
          items={data.especialidades.map((e) => ({ value: String(e.id), label: e.nombre }))}
        />
      </Field>
      <Field label={modalidad === 'METRO' ? 'Tarifa por m²' : 'Tarifa por día'} htmlFor="trab-tarifa">
        <Input id="trab-tarifa" name="tarifa" type="number" min={1} required defaultValue={item?.tarifaPersonal} />
      </Field>
    </FormDialog>
  )
}
