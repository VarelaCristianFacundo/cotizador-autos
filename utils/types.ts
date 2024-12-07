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
  tipoCobertura: string
  descripcionComercial: string
  detalleCoberturaRC: string
  detalleCoberturaCasco: string
  franquicia: string
  auxilioMecanico: string
  paisesLimitrofes: string
  itemsCobertura: string[]
}

export interface Localidad {
  id: number
  nombre: string
  codigo_postal: string
}

export interface RawData {
  id: number | null;
  responsabilidadCivil: string | null;
  descripcionComercial: string;
  numeroSolicitud: string | null;
  codigoRC: string;
  descripcionRC: string;
  detalleCoberturaRC: string;
  codigoCasco: string;
  descripcionCasco: string;
  detalleCoberturaCasco: string;
  prima: number;
  premio: number;
  iva: number;
  sumaAsegurada: number;
  ajusteAutomatico: string;
  ajustesAutomaticosPosibles: string[];
  franquicia: number;
  auxilioMecanico: string;
  paisesLimitrofes: string;
  coberturaVida: string;
  Cuotas: string;
  tipoVigencia: string;
}

export interface Subtipo {
  cotizacion_id: number | null;
  cobertura_cia_id: number;
  cobertura_cia_code: string;
  cotizacion_generada_id: number;
  cotizacion_generada_item_id: number;
  subtipo_cobertura: string;
  descripcion_cobertura: string;
  descripcion_cobertura_alternativa: string | null;
  codigo_producto: string | null;
  descripcion_producto: string | null;
  adicionales: any;
  premio: string;
  prima: string;
  comision: string | null;
  franquicia: string | null;
  iva: string;
  errores: any[];
  raw_data: RawData; // Añadimos esta propiedad
  items_cobertura: string[];
}