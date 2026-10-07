'use client'

import { MapPin, Pencil, Plus, Trash2, Warehouse } from 'lucide-react'
import { useState } from 'react'
import { EmptyState } from '@/components/shared/fields'
import { EstadoBadge } from '@/components/shared/estado-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useApp } from '@/lib/store'
import type { Maquina } from '@/lib/types'
import { MaquinaDialog } from './maquina-dialog'

export function MaquinasPanel() {
  const { data, obraFiltro, deleteMaquina } = useApp()
  const [dialog, setDialog] = useState<{ open: boolean; maquina?: Maquina; key: number }>({ open: false, key: 0 })
  const maquinas = obraFiltro === 'todas' ? data.maquinas : data.maquinas.filter((m) => m.obraActualId === obraFiltro)
  const abrir = (maquina?: Maquina) => setDialog((d) => ({ open: true, maquina, key: d.key + 1 }))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Máquinas y equipos</h1>
          <p className="text-sm text-muted-foreground">La ubicación se toma de la dirección de la obra asignada.</p>
        </div>
        <Button onClick={() => abrir()}>
          <Plus data-icon="inline-start" />
          Nueva máquina
        </Button>
      </div>

      <Card>
        <CardContent>
          {maquinas.length === 0 ? (
            <EmptyState>No hay máquinas asignadas a esta obra.</EmptyState>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Obra asignada</TableHead>
                  <TableHead>Ubicación actual</TableHead>
                  <TableHead className="sr-only">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maquinas.map((m) => {
                  const obra = data.obras.find((o) => o.id === m.obraActualId)
                  return (
                    <TableRow key={m.id}>
                      <TableCell>
                        <p className="font-medium">{m.nombre}</p>
                        <p className="text-xs text-muted-foreground">{m.marcaModelo}</p>
                      </TableCell>
                      <TableCell>
                        <EstadoBadge estado={m.estado} />
                      </TableCell>
                      <TableCell>{obra?.nombre ?? <span className="text-muted-foreground">Sin asignar</span>}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5 text-sm">
                          {obra ? (
                            <MapPin className="size-3.5 text-chart-1" aria-hidden="true" />
                          ) : (
                            <Warehouse className="size-3.5 text-muted-foreground" aria-hidden="true" />
                          )}
                          {obra?.direccion ?? 'En depósito'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon-sm" onClick={() => abrir(m)} aria-label={`Editar ${m.nombre}`}>
                            <Pencil />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Eliminar ${m.nombre}`}
                            onClick={() => {
                              if (window.confirm(`¿Eliminar ${m.nombre}?`)) deleteMaquina(m.id)
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
          )}
        </CardContent>
      </Card>

      <MaquinaDialog
        key={dialog.key}
        open={dialog.open}
        maquina={dialog.maquina}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
      />
    </div>
  )
}
