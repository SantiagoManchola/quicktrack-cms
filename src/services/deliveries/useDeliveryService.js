import { api } from 'src/boot/axios'

const getDeliveries = async ({ page, pageSize }) => {
  try {
    const response = await api.get(`carrier/deliveries?page=${page}&pageSize=${pageSize}`)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

const createDelivery = async (delivery) => {
  try {
    const response = await api.post('carrier/deliveries', delivery)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

export const useDeliveryService = () => {
  return { getDeliveries, createDelivery }
}
