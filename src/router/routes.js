const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('src/components/ss-dashboard/SsDashboard.vue'),
        meta: { requiresAuth: true, role: 'Driver' },
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
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
