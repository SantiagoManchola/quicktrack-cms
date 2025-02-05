import { api } from 'src/boot/axios'

const getCompanies = async ({ page, pageSize }) => {
  try {
    const response = await api.get(`admin/carriers?page=${page}&pageSize=${pageSize}`)
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
    throw error.response.data.message
  }
}

export const useCompanyService = () => {
  return { getCompanies, createCompany }
}
