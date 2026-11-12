import { getLocalidadesData } from '@/lib/catalogo'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: { provinceId: string } }) {
  return NextResponse.json(getLocalidadesData().localidades[params.provinceId] ?? [])
}
