// Acceso (solo servidor) a la base local de vehículos y localidades.
import fs from 'node:fs'
import path from 'node:path'

export type Vehiculo = {
  codigo: string
  origen: string
  marca: string
  modelo: string
  tipo: string
  valores: Record<string, number> // "0km" | "2025" | ... -> valor en ARS
}

type VehiculosFile = { fuente: string; vigencia: string; importado: string; vehiculos: Vehiculo[] }
type LocalidadesFile = {
  provincias: { id: string; nombre: string }[]
  localidades: Record<string, { id: number; nombre: string; codigo_postal: string }[]>
}

// Tipos de carrocería que se cotizan como "auto" (excluye motos, camiones, chasis, tractores, etc.)
const TIPOS_AUTO = /SEDAN|RURAL|TODO TERRENO|^TERRENO|PUERTAS|PICK-UP|CABINA (DOBLE|SIMPLE|Y MEDIA)|COUPE|DESCAPOTABLE|CABRIOLET|CONVERTIBLE|FAMILIAR|FURGONETA|MONOVOLUMEN|UTILITARIO|MINIBUS|SPORT|HATCHBACK|^SUV/
const TIPOS_EXCLUIDOS = /MOTO|CICLO|SCOOTER|CUATRI|TRICICLO|CAMION|CHASIS|TRACTOR|ACOPLADO|SEMIRREMOLQUE|OMNIBUS|TRANS\.?DE PASAJEROS|ARENERO|MAQUINA/

let vehiculosCache: VehiculosFile | null = null
let localidadesCache: LocalidadesFile | null = null

const readJson = <T,>(file: string): T =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', file), 'utf-8'))

export const getCatalogo = (): VehiculosFile => {
  if (!vehiculosCache) {
    const data = readJson<VehiculosFile>('vehiculos.json')
    data.vehiculos = data.vehiculos.filter(
      (v) => !TIPOS_EXCLUIDOS.test(v.tipo) && (TIPOS_AUTO.test(v.tipo) || v.tipo === '')
    )
    vehiculosCache = data
  }
  return vehiculosCache
}

export const getLocalidadesData = (): LocalidadesFile => {
  if (!localidadesCache) localidadesCache = readJson<LocalidadesFile>('localidades.json')
  return localidadesCache
}

/** Convierte el año del front ("0KM", "2021", 0, NaN) a la clave de la tabla de valores. */
export const claveAnio = (anio: unknown): string | null => {
  const s = String(anio ?? '').trim().toUpperCase()
  if (s === '0KM' || s === '0') return '0km'
  return /^\d{4}$/.test(s) ? s : null
}

export const getVehiculo = (codigo: string) => getCatalogo().vehiculos.find((v) => v.codigo === codigo)

/** Valor del vehículo para el año pedido; si no hay dato exacto usa el año más cercano. */
export const valorVehiculo = (v: Vehiculo, anio: string | null): { anio: string; valor: number } | null => {
  const entries = Object.entries(v.valores)
  if (!entries.length) return null
  if (anio && v.valores[anio]) return { anio, valor: v.valores[anio] }
  const num = (k: string) => (k === '0km' ? new Date().getFullYear() + 1 : Number(k))
  const target = anio ? num(anio) : num('0km')
  const [k, valor] = entries.sort((a, b) => Math.abs(num(a[0]) - target) - Math.abs(num(b[0]) - target))[0]
  return { anio: k, valor }
}
