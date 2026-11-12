import { claveAnio, getCatalogo } from '@/lib/catalogo'
import { NextResponse } from 'next/server'

const normalizar = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/\s+/g, ' ').trim()

// Body: { anio: number | "0KM", marca: string, modelo: string }
export async function POST(req: Request) {
  const { anio, marca, modelo } = await req.json().catch(() => ({}))
  if (!marca) return NextResponse.json({ car: [] })

  const year = claveAnio(anio)
  const terms = normalizar(String(modelo ?? '')).split(' ').filter(Boolean)
  const brand = normalizar(String(marca))

  const car = getCatalogo()
    .vehiculos.filter((v) => normalizar(v.marca) === brand)
    .filter((v) => !year || v.valores[year])
    .filter((v) => {
      const texto = normalizar(`${v.modelo} ${v.tipo}`)
      return terms.every((t) => texto.includes(t))
    })
    .slice(0, 50)
    .map((v) => ({
      id: v.codigo,
      model: v.tipo ? `${v.modelo} (${v.tipo})` : v.modelo,
      year: year === '0km' ? '0KM' : year ?? '',
      brand: v.marca,
    }))

  return NextResponse.json({ car })
}
