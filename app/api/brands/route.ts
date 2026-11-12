import { getCatalogo } from '@/lib/catalogo'
import { NextResponse } from 'next/server'

export async function GET() {
  const marcas = Array.from(new Set(getCatalogo().vehiculos.map((v) => v.marca))).sort()
  return NextResponse.json(marcas.map((brand) => ({ brand_id: brand, brand })))
}
