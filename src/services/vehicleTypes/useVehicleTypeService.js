import { api } from 'src/boot/axios'

const getVehicleTypes = async () => {
  try {
    const response = await api.get(`admin/vehicles-types`)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

const createVehicleType = async (vehicle) => {
  try {
    const response = await api.post('admin/vehicles-types', vehicle)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

const editVehicleType = async (id, data) => {
  try {
    const response = await api.patch(`admin/vehicles-types/${id}`, data)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

const deleteVehicleType = async (id) => {
  try {
    const response = await api.delete(`admin/vehicles-types/${id}`)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

export const useVehicleTypeService = () => {
  return { getVehicleTypes, createVehicleType, editVehicleType, deleteVehicleType }
}
