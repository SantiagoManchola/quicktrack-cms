import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { useAuthStore } from 'src/stores/auth'

const isProduction = process.env.NODE_ENV === 'production'
const apiBaseURL = isProduction
  ? process.env.VUE_APP_QUASAR_API_URL_PROD
  : process.env.VUE_APP_QUASAR_API_URL_DEV

console.log('API Base URL:', apiBaseURL)

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const excludedRoutes = ['/auth/login', '/auth/request-password-reset']

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()

    if (!excludedRoutes.some((route) => config.url.includes(route)) && authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore()

    if (error.response && error.response.status === 401) {
      authStore.logout()
    }

    return Promise.reject(error)
  },
)

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
