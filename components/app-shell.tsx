'use client'

import { CalendarDays, HardHat, LayoutDashboard, Building2, Wrench } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { DashboardPanel } from '@/components/dashboard/dashboard-panel'
import { MaquinasPanel } from '@/components/maquinas/maquinas-panel'
import { ObrasPanel } from '@/components/obras/obras-panel'
import { EquipoPanel } from '@/components/personal/equipo-panel'
import { SemanaPanel } from '@/components/semana/semana-panel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AppProvider } from '@/lib/store'

const TABS = [
  { value: 'dashboard', label: 'Balance', icon: LayoutDashboard, Panel: DashboardPanel },
  { value: 'semana', label: 'Carga semanal', icon: CalendarDays, Panel: SemanaPanel },
  { value: 'obras', label: 'Obras', icon: Building2, Panel: ObrasPanel },
  { value: 'maquinas', label: 'Máquinas', icon: Wrench, Panel: MaquinasPanel },
  { value: 'personal', label: 'Personal', icon: HardHat, Panel: EquipoPanel },
]

export function AppShell() {
  return (
    <AppProvider>
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Tabs defaultValue="dashboard" className="gap-6">
          <div className="-mx-4 overflow-x-auto px-4">
            <TabsList>
              {TABS.map(({ value, label, icon: Icon }) => (
                <TabsTrigger key={value} value={value} className="gap-1.5 px-3">
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {TABS.map(({ value, Panel }) => (
            <TabsContent key={value} value={value}>
              <Panel />
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </AppProvider>
  )
}
