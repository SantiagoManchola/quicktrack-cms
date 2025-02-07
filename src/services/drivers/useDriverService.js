import { api } from 'src/boot/axios'

const getDrivers = async ({ page, pageSize }) => {
  try {
    const response = await api.get(`carrier/drivers?page=${page}&pageSize=${pageSize}`)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

const createDriver = async (driver) => {
  try {
    const response = await api.post('carrier/drivers', driver)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

const editDriver = async (id, data) => {
  try {
    const response = await api.patch(`carrier/drivers/${id}`, data)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

const deleteDriver = async (id) => {
  try {
    const response = await api.delete(`carrier/drivers/${id}`)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

export const useDriverService = () => {
  return { getDrivers, createDriver, editDriver, deleteDriver }
}
