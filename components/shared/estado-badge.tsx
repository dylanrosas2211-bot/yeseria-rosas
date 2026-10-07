import { Badge } from '@/components/ui/badge'
import type { EstadoMaquina, EstadoObra } from '@/lib/types'
import { cn } from '@/lib/utils'

const ESTILOS: Record<EstadoObra | EstadoMaquina, string> = {
  Activa: 'border-positive/30 bg-positive/10 text-positive',
  Pausada: 'border-chart-1/40 bg-chart-1/10 text-chart-1',
  Finalizada: 'border-border bg-muted text-muted-foreground',
  'En Servicio': 'border-positive/30 bg-positive/10 text-positive',
  'En Mantenimiento': 'border-chart-1/40 bg-chart-1/10 text-chart-1',
  'Fuera de Servicio': 'border-destructive/30 bg-destructive/10 text-destructive',
}

export function EstadoBadge({ estado }: { estado: EstadoObra | EstadoMaquina }) {
  return (
    <Badge variant="outline" className={cn('gap-1.5 font-medium', ESTILOS[estado])}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {estado}
    </Badge>
  )
}
