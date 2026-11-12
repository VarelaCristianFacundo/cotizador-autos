// Motor de cotización ESTIMATIVA propio.
//
// No son precios oficiales de las aseguradoras: es una tarifa de referencia calculada a partir del
// valor del vehículo (tabla DNRPA), la zona y la antigüedad. Ajustá estos parámetros con precios
// reales que consigas (pólizas propias, cotizaciones del productor, etc.).
import type { ApiResponse } from '@/utils/types'

type Cobertura = {
  tipo: string // agrupador que muestra el front
  codigo: string
  descripcion: string
  detalleRC: string
  detalleCasco: string
  tasaMensual: number // % mensual sobre la suma asegurada
  fijoMensual: number // ARS mensuales fijos (RC, servicios, gastos)
  franquiciaPct?: number // % de la suma asegurada
  maxAntiguedad?: number // años; si el auto es más viejo no se ofrece
  items: string[]
}

const RC_LIMITE = 'Responsabilidad civil hasta el límite fijado por la SSN para automotores.'

export const COBERTURAS: Cobertura[] = [
  {
    tipo: 'Responsabilidad Civil',
    codigo: 'A',
    descripcion: 'Responsabilidad civil obligatoria',
    detalleRC: RC_LIMITE,
    detalleCasco: '',
    tasaMensual: 0,
    fijoMensual: 24000,
    items: ['Responsabilidad civil', 'Asistencia legal'],
  },
  {
    tipo: 'Terceros Completo',
    codigo: 'C',
    descripcion: 'RC + robo, hurto e incendio total y parcial, destrucción total',
    detalleRC: RC_LIMITE,
    detalleCasco: 'Robo/hurto total y parcial, incendio total y parcial, destrucción total por accidente.',
    tasaMensual: 0.22,
    fijoMensual: 24000,
    items: ['Responsabilidad civil', 'Robo e incendio total y parcial', 'Destrucción total', 'Auxilio mecánico'],
  },
  {
    tipo: 'Terceros Premium',
    codigo: 'C+',
    descripcion: 'Terceros completo + granizo, cristales y cerraduras',
    detalleRC: RC_LIMITE,
    detalleCasco:
      'Robo/hurto total y parcial, incendio total y parcial, destrucción total, daños por granizo, rotura de cristales y cerraduras.',
    tasaMensual: 0.3,
    fijoMensual: 26000,
    items: ['Responsabilidad civil', 'Robo e incendio total y parcial', 'Destrucción total', 'Granizo', 'Cristales y cerraduras', 'Auxilio mecánico'],
  },
  {
    tipo: 'Todo Riesgo',
    codigo: 'D',
    descripcion: 'Cobertura total con franquicia',
    detalleRC: RC_LIMITE,
    detalleCasco: 'Daños parciales y totales al vehículo propio por accidente, con franquicia a cargo del asegurado.',
    tasaMensual: 0.55,
    fijoMensual: 30000,
    franquiciaPct: 3,
    maxAntiguedad: 12,
    items: ['Responsabilidad civil', 'Daños parciales por accidente', 'Robo e incendio', 'Granizo', 'Cristales', 'Auxilio mecánico'],
  },
]

// Factor por compañía: ordena las ofertas de forma estable (no refleja tarifas reales de cada una)
export const COMPANIAS = [
  { key: 'rivadavia', nombre: 'Rivadavia', factor: 0.93 },
  { key: 'rus', nombre: 'Río Uruguay (RUS)', factor: 0.97 },
  { key: 'mercantil', nombre: 'Mercantil Andina', factor: 1.0 },
  { key: 'atm', nombre: 'ATM', factor: 0.9 },
  { key: 'integrity', nombre: 'Integrity', factor: 1.04 },
  { key: 'fedpat', nombre: 'Federación Patronal', factor: 1.06 },
  { key: 'allianz', nombre: 'Allianz', factor: 1.14 },
]

// Factor de zona por id de provincia (Georef). Default 1.
const ZONA: Record<string, number> = {
  '02': 1.25, // CABA
  '06': 1.2, // Buenos Aires
  '14': 1.05, // Córdoba
  '82': 1.08, // Santa Fe
  '50': 1.0, // Mendoza
  '90': 1.03, // Tucumán
}
const zonaFactor = (provincia?: string) => ZONA[String(provincia ?? '').padStart(2, '0')] ?? 0.92

// Autos viejos: la tasa de casco sube (más siniestralidad relativa al valor)
const antiguedadFactor = (antiguedad: number) => 1 + Math.min(Math.max(antiguedad - 5, 0), 15) * 0.02

type QuoteInput = {
  descripcion: string
  anio: string // "0km" | "2021"
  sumaAsegurada: number
  provincia?: string
}

export const cotizar = ({ descripcion, anio, sumaAsegurada, provincia }: QuoteInput): ApiResponse => {
  const year = anio === '0km' ? new Date().getFullYear() : Number(anio)
  const antiguedad = Math.max(0, new Date().getFullYear() - year)
  const zona = zonaFactor(provincia)
  const coberturas = COBERTURAS.filter((c) => c.maxAntiguedad === undefined || antiguedad <= c.maxAntiguedad)

  const result: Record<string, unknown> = {}
  COMPANIAS.forEach((cia, i) => {
    result[cia.key] = {
      cotizacion_id: i + 1,
      cotizaciones: [
        {
          cia: cia.nombre,
          codigo_cia: cia.key,
          suma_asegurada: sumaAsegurada,
          coberturas: coberturas.map((c) => {
            const casco = sumaAsegurada * (c.tasaMensual / 100) * antiguedadFactor(antiguedad)
            const premio = Math.round((casco + c.fijoMensual) * zona * cia.factor)
            const franquicia = c.franquiciaPct ? Math.round((sumaAsegurada * c.franquiciaPct) / 100) : 0
            return {
              tipo_cobertura: c.tipo,
              subtipos: [
                {
                  cobertura_cia_id: i + 1,
                  cobertura_cia_code: c.codigo,
                  premio: String(premio),
                  descripcion_cobertura: c.descripcion,
                  raw_data: {
                    descripcionComercial: `${c.tipo} - ${descripcion} (estimativa mensual)`,
                    detalleCoberturaRC: c.detalleRC,
                    detalleCoberturaCasco: c.detalleCasco,
                    franquicia: franquicia || '',
                    auxilioMecanico: c.codigo === 'A' ? '' : 'Incluido',
                    paisesLimitrofes: 'Incluido',
                  },
                  items_cobertura: c.items,
                },
              ],
            }
          }),
        },
      ],
    }
  })
  return result as ApiResponse
}
