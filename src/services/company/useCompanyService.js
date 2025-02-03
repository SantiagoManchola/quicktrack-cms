import { api } from 'src/boot/axios'

const getCompanies = async () => {
  try {
    const response = await api.get('admin/carriers')
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

const createCompany = async (company) => {
  try {
    const response = await api.post('admin/carriers', company)
    return response
  } catch (error) {
    return error
    /* throw error.response.data.message */
  }
}

export const useCompanyService = () => {
  return { getCompanies, createCompany }
}
