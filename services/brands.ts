export const fetchBrands = async () => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    const { getLocalBrands } = await import('./localData')
    return getLocalBrands()
  }
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands`)
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    return await response.json()
  } catch {
    const { getLocalBrands } = await import('./localData')
    return getLocalBrands()
  }
}
