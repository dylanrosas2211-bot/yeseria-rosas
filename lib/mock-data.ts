import { addDays } from './format'
import type {
  Adelanto,
  AppData,
  AsistenciaSemana,
  Especialidad,
  Maquina,
  Obra,
  ProduccionMetros,
  Trabajador,
  ValorDia,
} from './types'

export const SEMANAS = Array.from({ length: 8 }, (_, i) => addDays('2026-08-17', i * 7))

const especialidades: Especialidad[] = [
  { id: 1, nombre: 'Maquinista', modalidadPago: 'DIA' },
  { id: 2, nombre: 'Ayudante', modalidadPago: 'DIA' },
  { id: 3, nombre: 'Oficial yesero', modalidadPago: 'METRO' },
  { id: 4, nombre: 'Peón', modalidadPago: 'DIA' },
]

const trabajadores: Trabajador[] = [
  { id: 1, nombre: 'Carlos Gómez', especialidadId: 1, tarifaPersonal: 45000 },
  { id: 2, nombre: 'Luis Fernández', especialidadId: 2, tarifaPersonal: 32000 },
  { id: 3, nombre: 'Matías Ruiz', especialidadId: 2, tarifaPersonal: 30000 },
  { id: 4, nombre: 'Jorge Benítez', especialidadId: 3, tarifaPersonal: 2800 },
  { id: 5, nombre: 'Diego Sosa', especialidadId: 3, tarifaPersonal: 2600 },
  { id: 6, nombre: 'Ramón Acosta', especialidadId: 3, tarifaPersonal: 2700 },
  { id: 7, nombre: 'Nahuel Pereyra', especialidadId: 4, tarifaPersonal: 28000 },
]

const obras: Obra[] = [
  {
    id: 1,
    nombre: 'Torre Alvear',
    direccion: 'Av. Alvear 1450, Recoleta, CABA',
    nombreResponsable: 'Arq. Laura Méndez',
    telefonoResponsable: '+54 9 11 5555-1234',
    precioMetroCliente: 6800,
    estado: 'Activa',
    fechaCreacion: '2026-08-10',
  },
  {
    id: 2,
    nombre: 'Barrio Los Álamos – Casa 14',
    direccion: 'Ruta 8 km 52, Pilar, Buenos Aires',
    nombreResponsable: 'Arq. Martín Ortiz',
    telefonoResponsable: '+54 9 11 4433-9087',
    precioMetroCliente: 6200,
    estado: 'Activa',
    fechaCreacion: '2026-09-10',
  },
  {
    id: 3,
    nombre: 'Oficinas Puerto Madero',
    direccion: 'Juana Manso 1200, Puerto Madero, CABA',
    nombreResponsable: 'Ing. Sofía Ríos',
    telefonoResponsable: '+54 9 11 6021-7745',
    precioMetroCliente: 7200,
    estado: 'Pausada',
    fechaCreacion: '2026-08-30',
  },
  {
    id: 4,
    nombre: 'Complejo Nordelta Lote 7',
    direccion: 'Av. de los Lagos 7010, Nordelta, Tigre',
    nombreResponsable: 'Arq. Pablo Herrera',
    telefonoResponsable: '+54 9 11 3398-5521',
    precioMetroCliente: 6000,
    estado: 'Finalizada',
    fechaCreacion: '2026-08-05',
  },
]

const maquinas: Maquina[] = [
  { id: 1, nombre: 'Proyectora #1', marcaModelo: 'PFT G4 Ritmo', estado: 'En Servicio', obraActualId: 1 },
  { id: 2, nombre: 'Proyectora #2', marcaModelo: 'PFT G5c', estado: 'En Servicio', obraActualId: 2 },
  { id: 3, nombre: 'Mezcladora M-01', marcaModelo: 'Putzmeister MP 25', estado: 'En Mantenimiento', obraActualId: null },
  { id: 4, nombre: 'Compresor C-300', marcaModelo: 'Schulz CSL 30', estado: 'En Servicio', obraActualId: 1 },
  { id: 5, nombre: 'Proyectora #3', marcaModelo: 'Baumit PFT G4', estado: 'Fuera de Servicio', obraActualId: null },
]

/** Deterministic PRNG so server and client render the same mock data. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const PLAN = [
  { obraId: 1, desde: 0, hasta: 7, porDia: [1, 2], porMetro: [4, 5] },
  { obraId: 4, desde: 0, hasta: 2, porDia: [3, 7], porMetro: [6] },
  { obraId: 3, desde: 3, hasta: 4, porDia: [3, 7], porMetro: [6] },
  { obraId: 2, desde: 5, hasta: 7, porDia: [3, 7], porMetro: [6] },
]

/** Week 3 simulates a rainy week with lower output. */
const RENDIMIENTO_SEMANA = [1, 1.05, 0.9, 0.6, 1.1, 0.95, 1.15, 1]

function generarRegistros() {
  const rand = mulberry32(2211)
  const asistencias: AsistenciaSemana[] = []
  const producciones: ProduccionMetros[] = []
  const adelantos: Adelanto[] = []

  for (const tramo of PLAN) {
    const obra = obras.find((o) => o.id === tramo.obraId)!
    for (let w = tramo.desde; w <= tramo.hasta; w++) {
      const semana = SEMANAS[w]
      const factor = RENDIMIENTO_SEMANA[w]

      for (const trabajadorId of tramo.porDia) {
        const t = trabajadores.find((x) => x.id === trabajadorId)!
        const dias = Array.from({ length: 6 }, (): ValorDia => {
          const r = rand() / factor
          if (r > 0.95) return 0
          if (r > 0.82) return 0.5
          return 1
        })
        asistencias.push({
          id: asistencias.length + 1,
          obraId: obra.id,
          trabajadorId,
          fechaSemana: semana,
          dias,
          precioDiaAplicado: t.tarifaPersonal,
        })
      }

      for (const trabajadorId of tramo.porMetro) {
        const t = trabajadores.find((x) => x.id === trabajadorId)!
        producciones.push({
          id: producciones.length + 1,
          obraId: obra.id,
          trabajadorId,
          esMetrosContratista: false,
          fechaSemana: semana,
          metrosCuadrados: Math.round((130 + rand() * 90) * factor),
          precioMetroAplicado: t.tarifaPersonal,
        })
      }

      producciones.push({
        id: producciones.length + 1,
        obraId: obra.id,
        trabajadorId: null,
        esMetrosContratista: true,
        fechaSemana: semana,
        metrosCuadrados: Math.round((30 + rand() * 60) * factor),
        precioMetroAplicado: 0,
      })

      for (const trabajadorId of [...tramo.porDia, ...tramo.porMetro]) {
        if (rand() < 0.35) {
          adelantos.push({
            id: adelantos.length + 1,
            obraId: obra.id,
            trabajadorId,
            fecha: addDays(semana, Math.floor(rand() * 5)),
            monto: Math.round((15000 + rand() * 35000) / 5000) * 5000,
            concepto: rand() > 0.5 ? 'Adelanto semanal' : 'Vale',
          })
        }
      }
    }
  }

  return { asistencias, producciones, adelantos }
}

export function crearDatosIniciales(): AppData {
  return {
    especialidades,
    trabajadores,
    obras,
    maquinas,
    ...generarRegistros(),
  }
}
