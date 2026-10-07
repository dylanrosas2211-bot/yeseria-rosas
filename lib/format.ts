const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

export const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as const

const money = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})
const compact = new Intl.NumberFormat('es-AR', { notation: 'compact', maximumFractionDigits: 1 })
const decimal = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 })

export const formatMoney = (n: number) => money.format(n)
export const formatCompact = (n: number) => `$${compact.format(n)}`
export const formatNumber = (n: number) => decimal.format(n)
export const formatM2 = (n: number) => `${decimal.format(n)} m²`

export function addDays(iso: string, n: number) {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export function semanaDe(fecha: string) {
  const d = new Date(`${fecha}T00:00:00Z`)
  const offset = (d.getUTCDay() + 6) % 7
  return addDays(fecha, -offset)
}

export function formatFechaCorta(iso: string) {
  const [, m, d] = iso.split('-')
  return `${Number(d)} ${MESES[Number(m) - 1]}`
}

export function formatRangoSemana(lunes: string) {
  const sabado = addDays(lunes, 5)
  const [, m1, d1] = lunes.split('-')
  const [, m2, d2] = sabado.split('-')
  if (m1 === m2) return `${Number(d1)} – ${Number(d2)} ${MESES[Number(m2) - 1]}`
  return `${Number(d1)} ${MESES[Number(m1) - 1]} – ${Number(d2)} ${MESES[Number(m2) - 1]}`
}

export const soloDigitos = (telefono: string) => telefono.replace(/\D/g, '')
