export type ModalidadPago = 'DIA' | 'METRO'

export interface Especialidad {
  id: number
  nombre: string
  modalidadPago: ModalidadPago
}

export interface Trabajador {
  id: number
  nombre: string
  especialidadId: number
  tarifaPersonal: number
}

export type EstadoObra = 'Activa' | 'Pausada' | 'Finalizada'

export interface Obra {
  id: number
  nombre: string
  direccion: string
  nombreResponsable: string
  telefonoResponsable: string
  precioMetroCliente: number
  estado: EstadoObra
  fechaCreacion: string
}

export type EstadoMaquina = 'En Servicio' | 'En Mantenimiento' | 'Fuera de Servicio'

export interface Maquina {
  id: number
  nombre: string
  marcaModelo: string
  estado: EstadoMaquina
  obraActualId: number | null
}

export type ValorDia = 0 | 0.5 | 1

/** One row per worker, obra and week. `dias` holds Monday→Saturday values. */
export interface AsistenciaSemana {
  id: number
  obraId: number
  trabajadorId: number
  fechaSemana: string
  dias: ValorDia[]
  precioDiaAplicado: number
}

/** `trabajadorId` is null when the meters belong to the contractor. */
export interface ProduccionMetros {
  id: number
  obraId: number
  trabajadorId: number | null
  esMetrosContratista: boolean
  fechaSemana: string
  metrosCuadrados: number
  precioMetroAplicado: number
}

export interface Adelanto {
  id: number
  obraId: number
  trabajadorId: number
  fecha: string
  monto: number
  concepto: string
}

export interface AppData {
  especialidades: Especialidad[]
  trabajadores: Trabajador[]
  obras: Obra[]
  maquinas: Maquina[]
  asistencias: AsistenciaSemana[]
  producciones: ProduccionMetros[]
  adelantos: Adelanto[]
}

export type ObraFiltro = number | 'todas'
