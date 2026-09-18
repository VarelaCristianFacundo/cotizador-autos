export const fetchQuote = async (quoteData: any) => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    const { getLocalQuote } = await import('./localData')
    return getLocalQuote(quoteData)
  }
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
  } catch {
    const { getLocalQuote } = await import('./localData')
    return getLocalQuote(quoteData)
  }
}
