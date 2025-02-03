const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'companies',
        component: () => import('src/components/ss-companies/SsCompanies.vue'),
        meta: { requiresAuth: true, role: 'Admin' },
      },
      {
        path: '',
        name: 'vehicles',
        component: () => import('src/components/ss-vehicles/SsVehicles.vue'),
        meta: { requiresAuth: true, role: 'Admin' },
      },
      {
        path: '',
        name: 'splashes',
        component: () => import('src/components/ss-splashes/SsSplashes.vue'),
        meta: { requiresAuth: true, role: 'Admin' },
      },
    ],
  },

  {
    name: 'auth',
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    meta: {
      requiresAuth: false,
    },
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('src/components/auth/ss-loginForm/SsLoginForm.vue'),
      },
      {
        path: 'forgot-password',
        name: 'forgotPassword',
        component: () =>
          import('src/components/auth/ss-forgotPasswordForm/SsForgotPasswordForm.vue'),
      },
      {
        path: 'reset-password',
        name: 'resetPassword',
        component: () => import('src/components/auth/ss-resetPasswordForm/SsResetPasswordForm.vue'),
        meta: {
          background: 'reset-password-bg',
        },
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
