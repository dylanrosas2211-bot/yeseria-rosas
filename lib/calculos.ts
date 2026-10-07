import { formatFechaCorta, semanaDe } from './format'
import type { AppData, AsistenciaSemana, ObraFiltro, Trabajador } from './types'

export const diasAsistidos = (a: AsistenciaSemana) => a.dias.reduce<number>((s, d) => s + d, 0)
export const diasFaltados = (a: AsistenciaSemana) => a.dias.length - diasAsistidos(a)

interface Filtro {
  obraId: ObraFiltro
  semana?: string
}

const coincide = (f: Filtro, obraId: number, semana: string) =>
  (f.obraId === 'todas' || f.obraId === obraId) && (!f.semana || f.semana === semana)

export interface Balance {
  metrosOficiales: number
  metrosContratista: number
  ingresos: number
  costoMetros: number
  costoDias: number
  diasTotales: number
  adelantos: number
  egresos: number
  ganancia: number
  saldoAPagar: number
}

export function calcularBalance(data: AppData, filtro: Filtro): Balance {
  const precioCliente = new Map(data.obras.map((o) => [o.id, o.precioMetroCliente]))
  const b: Balance = {
    metrosOficiales: 0,
    metrosContratista: 0,
    ingresos: 0,
    costoMetros: 0,
    costoDias: 0,
    diasTotales: 0,
    adelantos: 0,
    egresos: 0,
    ganancia: 0,
    saldoAPagar: 0,
  }

  for (const p of data.producciones) {
    if (!coincide(filtro, p.obraId, p.fechaSemana)) continue
    b.ingresos += p.metrosCuadrados * (precioCliente.get(p.obraId) ?? 0)
    if (p.esMetrosContratista) {
      b.metrosContratista += p.metrosCuadrados
    } else {
      b.metrosOficiales += p.metrosCuadrados
      b.costoMetros += p.metrosCuadrados * p.precioMetroAplicado
    }
  }

  for (const a of data.asistencias) {
    if (!coincide(filtro, a.obraId, a.fechaSemana)) continue
    const dias = diasAsistidos(a)
    b.diasTotales += dias
    b.costoDias += dias * a.precioDiaAplicado
  }

  for (const ad of data.adelantos) {
    if (coincide(filtro, ad.obraId, semanaDe(ad.fecha))) b.adelantos += ad.monto
  }

  b.egresos = b.costoMetros + b.costoDias
  b.ganancia = b.ingresos - b.egresos
  b.saldoAPagar = b.egresos - b.adelantos
  return b
}

export function serieSemanal(data: AppData, obraId: ObraFiltro, semanas: string[]) {
  return semanas.map((semana) => {
    const b = calcularBalance(data, { obraId, semana })
    return {
      semana,
      label: formatFechaCorta(semana),
      ingresos: b.ingresos,
      egresos: b.egresos,
      ganancia: b.ganancia,
    }
  })
}

export interface FilaLiquidacion {
  trabajador: Trabajador
  especialidad: string
  modalidad: 'DIA' | 'METRO'
  cantidad: number
  bruto: number
  adelantos: number
  saldo: number
}

export function calcularLiquidacion(data: AppData, filtro: Required<Filtro>): FilaLiquidacion[] {
  const filas = new Map<number, FilaLiquidacion>()
  const fila = (trabajadorId: number) => {
    const existente = filas.get(trabajadorId)
    if (existente) return existente
    const trabajador = data.trabajadores.find((t) => t.id === trabajadorId)
    if (!trabajador) return null
    const esp = data.especialidades.find((e) => e.id === trabajador.especialidadId)
    const nueva: FilaLiquidacion = {
      trabajador,
      especialidad: esp?.nombre ?? '—',
      modalidad: esp?.modalidadPago ?? 'DIA',
      cantidad: 0,
      bruto: 0,
      adelantos: 0,
      saldo: 0,
    }
    filas.set(trabajadorId, nueva)
    return nueva
  }

  for (const a of data.asistencias) {
    if (!coincide(filtro, a.obraId, a.fechaSemana)) continue
    const dias = diasAsistidos(a)
    if (dias === 0) continue
    const f = fila(a.trabajadorId)
    if (!f) continue
    f.cantidad += dias
    f.bruto += dias * a.precioDiaAplicado
  }

  for (const p of data.producciones) {
    if (p.trabajadorId == null || !coincide(filtro, p.obraId, p.fechaSemana)) continue
    if (p.metrosCuadrados === 0) continue
    const f = fila(p.trabajadorId)
    if (!f) continue
    f.cantidad += p.metrosCuadrados
    f.bruto += p.metrosCuadrados * p.precioMetroAplicado
  }

  for (const ad of data.adelantos) {
    if (!coincide(filtro, ad.obraId, semanaDe(ad.fecha))) continue
    const f = fila(ad.trabajadorId)
    if (f) f.adelantos += ad.monto
  }

  return [...filas.values()]
    .map((f) => ({ ...f, saldo: f.bruto - f.adelantos }))
    .sort((a, b) => a.trabajador.nombre.localeCompare(b.trabajador.nombre))
}
