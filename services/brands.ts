export const fetchBrands = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands`)
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
