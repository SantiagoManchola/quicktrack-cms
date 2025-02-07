import { api } from 'src/boot/axios'

const getClients = async ({ page, pageSize }) => {
  try {
    const response = await api.get(`carrier/clients?page=${page}&pageSize=${pageSize}`)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

const createClient = async (company) => {
  try {
    const response = await api.post('carrier/clients', company)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

const editClient = async (id, data) => {
  try {
    const response = await api.patch(`carrier/clients/${id}`, data)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

const deleteClient = async (id) => {
  try {
    const response = await api.delete(`carrier/clients/${id}`)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

export const useClientService = () => {
  return { getClients, createClient, editClient, deleteClient }
}
