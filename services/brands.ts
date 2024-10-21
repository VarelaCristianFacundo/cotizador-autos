export const fetchBrands = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/brands')
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error fetching brands'
    )
  }
}
