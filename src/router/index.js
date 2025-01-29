import { defineRouter } from '#q-app/wrappers'
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'

export default defineRouter(() => {
  const createHistory =
    process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory

  const Router = createRouter({
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const $q = useQuasar()

    authStore.checkAuth(Router, $q)

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return next({ path: '/auth' })
    }

    if (to.meta.role && to.meta.role !== authStore.userRole) {
      return next({ path: '/' })
    }

    if (authStore.isAuthenticated && to.path.startsWith('/auth')) {
      return next({ path: '/' })
    }

    next()
  })

  return Router
})
