export const fetchQuote = async (quoteData: any) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quoteData),
    })

    if (!response.ok) {
      throw new Error('Error al realizar la solicitud de cotización')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en fetchQuote:', error)
    throw error
  }
}
