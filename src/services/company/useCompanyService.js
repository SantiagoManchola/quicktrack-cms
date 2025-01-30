import { api } from 'src/boot/axios'

const getCompanies = async () => {
  try {
    const response = await api.get('admin/carriers')
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

export const useCompanyService = () => {
  return { getCompanies }
}
