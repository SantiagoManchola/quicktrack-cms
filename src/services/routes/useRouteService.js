import { api } from 'src/boot/axios'

const createRoute = async (route) => {
  try {
    const response = await api.post('carrier/routes', route)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

export const useRouteService = () => {
  return { createRoute }
}
