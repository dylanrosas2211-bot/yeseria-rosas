'use client'

import { MapPin, MessageCircle, Pencil, Phone, Plus, Trash2, UserRound } from 'lucide-react'
import { useState } from 'react'
import { EstadoBadge } from '@/components/shared/estado-badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { calcularBalance } from '@/lib/calculos'
import { formatMoney, soloDigitos } from '@/lib/format'
import { useApp } from '@/lib/store'
import type { Obra } from '@/lib/types'
import { ObraDialog } from './obra-dialog'

export function ObrasPanel() {
  const { data, obraFiltro, deleteObra } = useApp()
  const [dialog, setDialog] = useState<{ open: boolean; obra?: Obra; key: number }>({ open: false, key: 0 })
  const obras = obraFiltro === 'todas' ? data.obras : data.obras.filter((o) => o.id === obraFiltro)

  const abrir = (obra?: Obra) => setDialog((d) => ({ open: true, obra, key: d.key + 1 }))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Obras</h1>
          <p className="text-sm text-muted-foreground">{`${data.obras.filter((o) => o.estado === 'Activa').length} activas de ${data.obras.length}`}</p>
        </div>
        <Button onClick={() => abrir()}>
          <Plus data-icon="inline-start" />
          Nueva obra
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {obras.map((obra) => {
          const b = calcularBalance(data, { obraId: obra.id })
          const digitos = soloDigitos(obra.telefonoResponsable)
          const maquinas = data.maquinas.filter((m) => m.obraActualId === obra.id).length
          return (
            <Card key={obra.id}>
              <CardHeader>
                <CardTitle className="text-pretty">{obra.nombre}</CardTitle>
                <CardDescription className="flex items-start gap-1.5">
                  <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  {obra.direccion}
                </CardDescription>
                <CardAction>
                  <EstadoBadge estado={obra.estado} />
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <UserRound className="size-4 text-muted-foreground" aria-hidden="true" />
                  <span className="flex-1">{obra.nombreResponsable || 'Sin responsable'}</span>
                </div>
                {digitos && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" render={<a href={`tel:${digitos}`} />} nativeButton={false}>
                      <Phone data-icon="inline-start" />
                      Llamar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      nativeButton={false}
                      render={<a href={`https://wa.me/${digitos}`} target="_blank" rel="noopener noreferrer" />}
                    >
                      <MessageCircle data-icon="inline-start" />
                      WhatsApp
                    </Button>
                  </div>
                )}
                <dl className="grid grid-cols-3 gap-2 rounded-lg bg-muted/60 p-3">
                  <div>
                    <dt className="text-xs text-muted-foreground">Precio m²</dt>
                    <dd className="font-mono font-medium tabular-nums">{formatMoney(obra.precioMetroCliente)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Máquinas</dt>
                    <dd className="font-mono font-medium tabular-nums">{maquinas}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Ganancia</dt>
                    <dd className="font-mono font-medium tabular-nums text-positive">{formatMoney(b.ganancia)}</dd>
                  </div>
                </dl>
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => abrir(obra)}>
                  <Pencil data-icon="inline-start" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => {
                    if (window.confirm(`¿Eliminar "${obra.nombre}" y todos sus registros?`)) deleteObra(obra.id)
                  }}
                >
                  <Trash2 data-icon="inline-start" />
                  Eliminar
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <ObraDialog
        key={dialog.key}
        open={dialog.open}
        obra={dialog.obra}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
      />
    </div>
  )
}
