import { getLocalidadesData } from '@/lib/catalogo'
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ province: getLocalidadesData().provincias })
}
