'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { crearDatosIniciales, SEMANAS } from './mock-data'
import type {
  Adelanto,
  AppData,
  Especialidad,
  Maquina,
  Obra,
  ObraFiltro,
  Trabajador,
  ValorDia,
} from './types'

type ConIdOpcional<T extends { id: number }> = Omit<T, 'id'> & { id?: number }
export type ObraInput = ConIdOpcional<Omit<Obra, 'fechaCreacion'>>

const nextId = (list: { id: number }[]) => list.reduce((max, x) => Math.max(max, x.id), 0) + 1

function upsert<T extends { id: number }>(list: T[], input: ConIdOpcional<T>): T[] {
  if (input.id != null) return list.map((x) => (x.id === input.id ? ({ ...x, ...input } as T) : x))
  return [...list, { ...input, id: nextId(list) } as T]
}

interface AppContextValue {
  data: AppData
  semanas: string[]
  semana: string
  setSemana: (s: string) => void
  obraFiltro: ObraFiltro
  setObraFiltro: (o: ObraFiltro) => void
  saveObra: (input: ObraInput) => void
  deleteObra: (id: number) => void
  saveMaquina: (input: ConIdOpcional<Maquina>) => void
  deleteMaquina: (id: number) => void
  saveEspecialidad: (input: ConIdOpcional<Especialidad>) => void
  deleteEspecialidad: (id: number) => boolean
  saveTrabajador: (input: ConIdOpcional<Trabajador>) => void
  deleteTrabajador: (id: number) => void
  setAsistenciaDia: (obraId: number, trabajadorId: number, dia: number, valor: ValorDia) => void
  setMetros: (obraId: number, trabajadorId: number | null, metros: number) => void
  addAdelanto: (input: Omit<Adelanto, 'id'>) => void
  deleteAdelanto: (id: number) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(crearDatosIniciales)
  const [semana, setSemana] = useState(SEMANAS[SEMANAS.length - 1])
  const [obraFiltro, setObraFiltro] = useState<ObraFiltro>('todas')

  const value: AppContextValue = {
    data,
    semanas: SEMANAS,
    semana,
    setSemana,
    obraFiltro,
    setObraFiltro,

    saveObra: (input) =>
      setData((d) => {
        if (input.id != null) return { ...d, obras: upsert(d.obras, input as ConIdOpcional<Obra>) }
        const nueva: Obra = {
          ...input,
          id: nextId(d.obras),
          fechaCreacion: new Date().toISOString().slice(0, 10),
        }
        return { ...d, obras: [...d.obras, nueva] }
      }),

    deleteObra: (id) => {
      setData((d) => ({
        ...d,
        obras: d.obras.filter((o) => o.id !== id),
        maquinas: d.maquinas.map((m) => (m.obraActualId === id ? { ...m, obraActualId: null } : m)),
        asistencias: d.asistencias.filter((a) => a.obraId !== id),
        producciones: d.producciones.filter((p) => p.obraId !== id),
        adelantos: d.adelantos.filter((a) => a.obraId !== id),
      }))
      if (obraFiltro === id) setObraFiltro('todas')
    },

    saveMaquina: (input) => setData((d) => ({ ...d, maquinas: upsert(d.maquinas, input) })),
    deleteMaquina: (id) => setData((d) => ({ ...d, maquinas: d.maquinas.filter((m) => m.id !== id) })),

    saveEspecialidad: (input) =>
      setData((d) => ({ ...d, especialidades: upsert(d.especialidades, input) })),
    deleteEspecialidad: (id) => {
      if (data.trabajadores.some((t) => t.especialidadId === id)) return false
      setData((d) => ({ ...d, especialidades: d.especialidades.filter((e) => e.id !== id) }))
      return true
    },

    saveTrabajador: (input) => setData((d) => ({ ...d, trabajadores: upsert(d.trabajadores, input) })),
    deleteTrabajador: (id) =>
      setData((d) => ({
        ...d,
        trabajadores: d.trabajadores.filter((t) => t.id !== id),
        asistencias: d.asistencias.filter((a) => a.trabajadorId !== id),
        producciones: d.producciones.filter((p) => p.trabajadorId !== id),
        adelantos: d.adelantos.filter((a) => a.trabajadorId !== id),
      })),

    setAsistenciaDia: (obraId, trabajadorId, dia, valor) =>
      setData((d) => {
        const existente = d.asistencias.find(
          (a) => a.obraId === obraId && a.trabajadorId === trabajadorId && a.fechaSemana === semana,
        )
        if (existente) {
          return {
            ...d,
            asistencias: d.asistencias.map((a) =>
              a === existente ? { ...a, dias: a.dias.map((v, i) => (i === dia ? valor : v)) } : a,
            ),
          }
        }
        const tarifa = d.trabajadores.find((t) => t.id === trabajadorId)?.tarifaPersonal ?? 0
        const dias: ValorDia[] = [0, 0, 0, 0, 0, 0]
        dias[dia] = valor
        return {
          ...d,
          asistencias: [
            ...d.asistencias,
            { id: nextId(d.asistencias), obraId, trabajadorId, fechaSemana: semana, dias, precioDiaAplicado: tarifa },
          ],
        }
      }),

    setMetros: (obraId, trabajadorId, metros) =>
      setData((d) => {
        const existente = d.producciones.find(
          (p) => p.obraId === obraId && p.trabajadorId === trabajadorId && p.fechaSemana === semana,
        )
        if (existente) {
          return {
            ...d,
            producciones: d.producciones.map((p) =>
              p === existente ? { ...p, metrosCuadrados: metros } : p,
            ),
          }
        }
        const tarifa =
          trabajadorId == null ? 0 : (d.trabajadores.find((t) => t.id === trabajadorId)?.tarifaPersonal ?? 0)
        return {
          ...d,
          producciones: [
            ...d.producciones,
            {
              id: nextId(d.producciones),
              obraId,
              trabajadorId,
              esMetrosContratista: trabajadorId == null,
              fechaSemana: semana,
              metrosCuadrados: metros,
              precioMetroAplicado: tarifa,
            },
          ],
        }
      }),

    addAdelanto: (input) =>
      setData((d) => ({ ...d, adelantos: [...d.adelantos, { ...input, id: nextId(d.adelantos) }] })),
    deleteAdelanto: (id) => setData((d) => ({ ...d, adelantos: d.adelantos.filter((a) => a.id !== id) })),
  }

  return <AppContext value={value}>{children}</AppContext>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
