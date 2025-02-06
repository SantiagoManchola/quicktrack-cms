import { api } from 'src/boot/axios'

const getPlans = async () => {
  try {
    const response = await api.get(`admin/plans`)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

export const usePlansService = () => {
  return { getPlans }
}
