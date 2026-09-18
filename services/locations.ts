import { Localidad } from '@/utils/types'

export const fetchProvinces = async () => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    const { getLocalProvinces } = await import('./localData')
    return getLocalProvinces()
  }
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/provinces`)
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    return await response.json()
  } catch {
    const { getLocalProvinces } = await import('./localData')
    return getLocalProvinces()
  }
}

/**
 * Esta función se encargará de obtener las localidades de una provincia
 * y retornarlas siempre como un arreglo de Localidad.
 */
export const fetchLocationsByProvince = async (
  provinceId: string
): Promise<Localidad[]> => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    const { getLocalLocations } = await import('./localData')
    return getLocalLocations(provinceId)
  }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/locations/${provinceId}`
    )
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    const data = await response.json()
    // Verificamos si la respuesta es un arreglo o un objeto con la propiedad "location"
    if (Array.isArray(data)) {
      return data
    } else if (data.location && Array.isArray(data.location)) {
      return data.location
    }
    return [] // Si no cumple ninguna de las dos, retornamos un arreglo vacío
  } catch {
    const { getLocalLocations } = await import('./localData')
    return getLocalLocations(provinceId)
  }
}
