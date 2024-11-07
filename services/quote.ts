export const fetchQuote = async (quoteData: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quoteData),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al obtener la cotización'
    )
  }
}
