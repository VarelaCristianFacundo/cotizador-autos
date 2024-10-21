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
      const response = await fetch('http://127.0.0.1:8000/auth', {
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
      saveToken(token) // Guardar el token en localStorage para futuras solicitudes
    } catch (error) {
      console.error('Error al obtener el token:', error)
      throw error
    }
  }

  return token
}
