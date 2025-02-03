import { api } from 'src/boot/axios'

const login = async (data) => {
  try {
    const response = await api.post('auth/login', data)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

const recoverPassword = async (data) => {
  try {
    const response = await api.post('auth/request-password-reset', data)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

const resetPassword = async (data) => {
  try {
    const response = await api.post('auth/reset-password', data)
    return response
  } catch (error) {
    throw error.response.data.message
  }
}

export const useAuthService = () => {
  return { login, recoverPassword, resetPassword }
}
