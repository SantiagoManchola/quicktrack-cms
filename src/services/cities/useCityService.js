import { api } from 'src/boot/axios'

export const getCities = async () => {
  try {
    const response = await api.get('cities')
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

export const useCityService = () => {
  return { getCities }
}
