type CarModelRequestBody = {
  anio: number
  marca: string
  modelo: string
}

export const fetchModelsByBrandAndYear = async (data: CarModelRequestBody) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al obtener los modelos'
    )
  }
}
