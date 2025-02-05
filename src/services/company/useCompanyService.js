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

const editCompany = async (id, data) => {
  try {
    const response = await api.patch(`admin/carriers/${id}`, data)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

const deleteCompany = async (id) => {
  try {
    const response = await api.delete(`admin/carriers/${id}`)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

export const useCompanyService = () => {
  return { getCompanies, createCompany, editCompany, deleteCompany }
}
