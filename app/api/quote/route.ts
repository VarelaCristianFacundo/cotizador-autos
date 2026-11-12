import { claveAnio, getVehiculo, valorVehiculo } from '@/lib/catalogo'
import { cotizar } from '@/lib/tarifas'
import { NextResponse } from 'next/server'

// Body: el mismo quoteData que arma components/ui/DataModal.tsx (id_modelo = código DNRPA)
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const vehiculo = body?.id_modelo ? getVehiculo(String(body.id_modelo)) : undefined
  if (!vehiculo) {
    return NextResponse.json({ detail: 'Vehículo no encontrado' }, { status: 404 })
  }

  const valor = valorVehiculo(vehiculo, claveAnio(body.anio))
  if (!valor) {
    return NextResponse.json({ detail: 'El vehículo no tiene valuación' }, { status: 404 })
  }

  return NextResponse.json(
    cotizar({
      descripcion: `${vehiculo.marca} ${vehiculo.modelo} ${valor.anio === '0km' ? '0KM' : valor.anio}`,
      anio: valor.anio,
      sumaAsegurada: valor.valor,
      provincia: body.provincia,
    })
  )
}
