import { Localidad } from '@/utils/types'

export const fetchProvinces = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/provinces`)
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error fetching provinces'
    )
  }
}

export const fetchLocationsByProvince = async (
  provinceId: string
): Promise<{ location: Localidad[] }> => {
  try {
    // Modificar la URL para usar provinceId en la ruta, no como query param
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/locations/${provinceId}`
    )
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error fetching locations'
    )
  }
}
