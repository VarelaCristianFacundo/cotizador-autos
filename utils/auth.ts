// Obtener el token desde localStorage
export const getToken = () => {
  return localStorage.getItem('token')
}

// Guardar el token en localStorage
export const saveToken = (token: string) => {
  localStorage.setItem('token', token)
}

// Obtener el token desde el backend si no existe
export const fetchToken = async () => {
  let token = getToken()

  if (!token) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Error al obtener el token')
      }

      const data = await response.json()
      token = data // El token es el cuerpo de la respuesta
      if (token) {
        saveToken(token) // Guardar el token en localStorage solo si es válido
      } else {
        throw new Error('Token es nulo o inválido')
      }
    } catch (error) {
      console.error('Error al obtener el token:', error)
      throw error
    }
  }

  return token
}
