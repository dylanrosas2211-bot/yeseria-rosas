'use client'

import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatMoney } from '@/lib/format'
import { useApp } from '@/lib/store'
import type { Especialidad, Trabajador } from '@/lib/types'
import { EspecialidadDialog, TrabajadorDialog } from './equipo-dialogs'

export function EquipoPanel() {
  const { data, deleteEspecialidad, deleteTrabajador } = useApp()
  const [esp, setEsp] = useState<{ open: boolean; item?: Especialidad; key: number }>({ open: false, key: 0 })
  const [trab, setTrab] = useState<{ open: boolean; item?: Trabajador; key: number }>({ open: false, key: 0 })
  const especialidad = (id: number) => data.especialidades.find((e) => e.id === id)

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Especialidades</CardTitle>
          <CardDescription>Cargos y modalidad de cobro</CardDescription>
          <CardAction>
            <Button size="sm" variant="outline" onClick={() => setEsp((s) => ({ open: true, key: s.key + 1 }))}>
              <Plus data-icon="inline-start" />
              Agregar
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {data.especialidades.map((e) => {
              const cantidad = data.trabajadores.filter((t) => t.especialidadId === e.id).length
              return (
                <li key={e.id} className="flex items-center gap-2 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{e.nombre}</p>
                    <p className="text-xs text-muted-foreground">{`${cantidad} trabajadores`}</p>
                  </div>
                  <Badge variant="secondary">{e.modalidadPago === 'DIA' ? 'Por día' : 'Por m²'}</Badge>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Editar ${e.nombre}`}
                    onClick={() => setEsp((s) => ({ open: true, item: e, key: s.key + 1 }))}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Eliminar ${e.nombre}`}
                    onClick={() => {
                      if (!deleteEspecialidad(e.id)) window.alert('No se puede eliminar: hay trabajadores con esta especialidad.')
                    }}
                  >
                    <Trash2 />
                  </Button>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Trabajadores</CardTitle>
          <CardDescription>Cada trabajador tiene su tarifa individual</CardDescription>
          <CardAction>
            <Button size="sm" onClick={() => setTrab((s) => ({ open: true, key: s.key + 1 }))}>
              <Plus data-icon="inline-start" />
              Nuevo trabajador
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead className="text-right">Tarifa</TableHead>
                <TableHead className="sr-only">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.trabajadores.map((t) => {
                const e = especialidad(t.especialidadId)
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.nombre}</TableCell>
                    <TableCell className="text-muted-foreground">{e?.nombre ?? '—'}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {`${formatMoney(t.tarifaPersonal)} / ${e?.modalidadPago === 'METRO' ? 'm²' : 'día'}`}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Editar ${t.nombre}`}
                          onClick={() => setTrab((s) => ({ open: true, item: t, key: s.key + 1 }))}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Eliminar ${t.nombre}`}
                          onClick={() => {
                            if (window.confirm(`¿Eliminar a ${t.nombre} y sus registros?`)) deleteTrabajador(t.id)
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EspecialidadDialog
        key={`e${esp.key}`}
        open={esp.open}
        item={esp.item}
        onOpenChange={(open) => setEsp((s) => ({ ...s, open }))}
      />
      <TrabajadorDialog
        key={`t${trab.key}`}
        open={trab.open}
        item={trab.item}
        onOpenChange={(open) => setTrab((s) => ({ ...s, open }))}
      />
    </div>
  )
}
