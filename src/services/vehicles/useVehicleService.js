import { api } from 'src/boot/axios'

const getVehicles = async () => {
  try {
    const response = await api.get(`carrier/vehicles`)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

const createVehicle = async (vehicle) => {
  try {
    const response = await api.post('carrier/vehicles', vehicle)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

const editVehicle = async (id, data) => {
  try {
    const response = await api.patch(`carrier/vehicles/${id}`, data)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

const deleteVehicle = async (id) => {
  try {
    const response = await api.delete(`carrier/vehicles/${id}`)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

export const useVehicleService = () => {
  return { getVehicles, createVehicle, editVehicle, deleteVehicle }
}
