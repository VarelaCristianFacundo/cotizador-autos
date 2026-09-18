import { ApiResponse, Localidad } from '@/utils/types'

type LocalBrand = { brand_id: string; brand: string }
type LocalCar = { id: number; model: string; year: string; brand: string }

const brands: LocalBrand[] = [
  { brand_id: 'vw', brand: 'Volkswagen' },
  { brand_id: 'renault', brand: 'Renault' },
  { brand_id: 'peugeot', brand: 'Peugeot' },
  { brand_id: 'chevrolet', brand: 'Chevrolet' },
  { brand_id: 'ford', brand: 'Ford' },
  { brand_id: 'fiat', brand: 'Fiat' },
  { brand_id: 'toyota', brand: 'Toyota' },
  { brand_id: 'citroen', brand: 'Citroen' },
]

const cars: LocalCar[] = [
  { id: 1001, model: 'Gol Trend', year: '2015', brand: 'Volkswagen' },
  { id: 1002, model: 'Polo', year: '2020', brand: 'Volkswagen' },
  { id: 1003, model: 'T-Cross', year: '2022', brand: 'Volkswagen' },
  { id: 2001, model: 'Clio', year: '2015', brand: 'Renault' },
  { id: 2002, model: 'Sandero', year: '2020', brand: 'Renault' },
  { id: 2003, model: 'Duster', year: '2022', brand: 'Renault' },
  { id: 3001, model: '208', year: '2020', brand: 'Peugeot' },
  { id: 3002, model: '2008', year: '2022', brand: 'Peugeot' },
  { id: 4001, model: 'Onix', year: '2020', brand: 'Chevrolet' },
  { id: 5001, model: 'Ka', year: '2018', brand: 'Ford' },
  { id: 5002, model: 'Territory', year: '2022', brand: 'Ford' },
  { id: 6001, model: 'Cronos', year: '2022', brand: 'Fiat' },
  { id: 7001, model: 'Etios', year: '2018', brand: 'Toyota' },
  { id: 7002, model: 'Corolla', year: '2022', brand: 'Toyota' },
]

const provinces = [
  { id: 'caba', nombre: 'Ciudad Autónoma de Buenos Aires' },
  { id: 'buenos-aires', nombre: 'Buenos Aires' },
  { id: 'cordoba', nombre: 'Córdoba' },
  { id: 'santa-fe', nombre: 'Santa Fe' },
]

const locations: Record<string, Localidad[]> = {
  caba: [{ id: 1, nombre: 'Ciudad Autónoma de Buenos Aires', codigo_postal: '1000' }],
  'buenos-aires': [
    { id: 2, nombre: 'La Plata', codigo_postal: '1900' },
    { id: 3, nombre: 'Tigre', codigo_postal: '1648' },
    { id: 4, nombre: 'Mar del Plata', codigo_postal: '7600' },
  ],
  cordoba: [{ id: 5, nombre: 'Córdoba', codigo_postal: '5000' }],
  'santa-fe': [{ id: 6, nombre: 'Rosario', codigo_postal: '2000' }],
}

const companyConfigs = [
  { name: 'Rivadavia', base: 42000, multiplier: 1 },
  { name: 'Mercantil Andina', base: 45500, multiplier: 1.08 },
  { name: 'Allianz', base: 52000, multiplier: 1.16 },
]

export const getLocalBrands = () => brands

export const getLocalModels = (brand: string, year: number, query: string) =>
  cars.filter((car) =>
    car.brand.toLowerCase() === brand.toLowerCase() &&
    (car.year === String(year) || year === 0) &&
    car.model.toLowerCase().includes(query.toLowerCase())
  )

export const getLocalProvinces = () => ({ province: provinces })

export const getLocalLocations = (provinceId: string) => locations[provinceId] || []

export const getLocalQuote = (quoteData: { anio?: string; id_modelo?: string }): ApiResponse => {
  const year = quoteData.anio === '0KM' ? new Date().getFullYear() : Number(quoteData.anio) || new Date().getFullYear()
  const ageFactor = Math.max(0.75, 1 - Math.max(0, new Date().getFullYear() - year) * 0.018)
  const insuredValue = Math.round(12500000 * ageFactor)

  return Object.fromEntries(companyConfigs.map((company) => [company.name, {
      cotizacion_id: Number(quoteData.id_modelo) || 0,
      cotizaciones: [{
        cia: company.name,
        codigo_cia: company.name.toLowerCase().replace(/[^a-z]+/g, '-'),
        suma_asegurada: insuredValue,
        coberturas: [{
          tipo_cobertura: 'Terceros completo',
          subtipos: [{
            cobertura_cia_id: 1,
            cobertura_cia_code: 'TC',
            premio: String(Math.round(company.base * company.multiplier * ageFactor)),
            descripcion_cobertura: 'Responsabilidad civil, robo e incendio',
            raw_data: {
              descripcionComercial: 'Cotización estimativa',
              detalleCoberturaRC: 'Responsabilidad civil con límite reglamentario.',
              detalleCoberturaCasco: 'Robo total e incendio total.',
              franquicia: 0,
              auxilioMecanico: 'Incluido',
              paisesLimitrofes: 'Incluido',
            },
            items_cobertura: [],
          }],
        }],
      }],
    }] as const)) as unknown as ApiResponse
}