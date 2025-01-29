import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || null,
    userRole: null,
    isAuthenticated: false,
    logoutTimer: null,
  }),

  actions: {
    login(token, keepSession, expiresIn, router, $q, t) {
      const storage = keepSession ? localStorage : sessionStorage
      const expirationTime = Date.now() + expiresIn * 1000

      storage.setItem('authToken', token)
      storage.setItem('authExpiration', expirationTime)

      this.token = token
      const decoded = jwtDecode(token)
      this.userRole = decoded.roles ? decoded.roles[0] : null
      this.isAuthenticated = true

      this.setupAutoLogout(expiresIn * 1000, router, $q, t)
    },

    logout(router, $q, t) {
      localStorage.removeItem('authToken')
      sessionStorage.removeItem('authToken')
      localStorage.removeItem('authExpiration')
      sessionStorage.removeItem('authExpiration')

      this.token = null
      this.userRole = null
      this.isAuthenticated = false

      if (this.logoutTimer) {
        clearTimeout(this.logoutTimer)
      }

      if ($q) {
        $q.notify({
          type: 'warning',
          message: t('sessionExpired'),
          position: 'top',
          timeout: 5000,
        })
      }

      if (router) {
        router.push({ name: 'login' })
      }
    },

    checkAuth(router, $q, t) {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      const expiration =
        localStorage.getItem('authExpiration') || sessionStorage.getItem('authExpiration')

      if (token && expiration) {
        const now = Date.now()
        if (now >= expiration) {
          this.logout(router, $q, t)
          return
        }

        this.token = token
        const decoded = jwtDecode(token)
        this.userRole = decoded.roles ? decoded.roles[0] : null
        this.isAuthenticated = true
      }
    },

    setupAutoLogout(expirationTime, router, $q, t) {
      if (this.logoutTimer) {
        clearTimeout(this.logoutTimer)
      }

      const timeLeft = expirationTime - Date.now()

      if (timeLeft > 0) {
        this.logoutTimer = setTimeout(() => {
          this.logout(router, $q, t)
        }, timeLeft)
      } else {
        this.logout(router, $q, t)
      }
    },
  },
})
