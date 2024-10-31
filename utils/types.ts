// Definición de Subtipo
export interface Subtipo {
  cobertura_cia_id: number
  cobertura_cia_code: string
  premio: string
  descripcion_cobertura: string
}

// Definición de Cobertura
export interface Cobertura {
  tipo_cobertura: string
  subtipos: Subtipo[]
}

// Definición de Cotizacion (Datos de la API)
export interface Cotizacion {
  cia: string
  codigo_cia: string
  suma_asegurada: number
  coberturas: Cobertura[]
}

// Definición de CompanyData
export interface CompanyData {
  cotizacion_id: number
  cotizaciones: Cotizacion[]
}

// Definición de ApiResponse
export type ApiResponse = Record<string, CompanyData>

// Definición de CotizacionItem (Para uso interno en tu aplicación)
export interface CotizacionItem {
  aseguradora: string
  precio: number
  cobertura: string
  sumaAsegurada: number
}

export interface Localidad {
  id: number
  nombre: string
  codigo_postal: string
}
