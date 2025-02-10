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
        path: 'companies',
        name: 'companies',
        component: () => import('src/components/ss-companies/SsCompanies.vue'),
        meta: { requiresAuth: true, role: 'Admin' },
      },
      {
        path: 'vehicle-types',
        name: 'vehiclesTypes',
        component: () => import('src/components/ss-vehiclesTypes/SsVehiclesTypes.vue'),
        meta: { requiresAuth: true, role: 'Admin' },
      },
      {
        path: 'splashes',
        name: 'splashes',
        component: () => import('src/components/ss-splashes/SsSplashes.vue'),
        meta: { requiresAuth: true, role: 'Admin' },
      },

      {
        path: 'clients',
        component: () => import('src/layouts/SsClientsLayout.vue'),
        meta: { requiresAuth: true, role: 'Carrier' },
        children: [
          {
            path: '',
            name: 'clients',
            component: () => import('src/components/ss-clients/SsClients.vue'),
          },
          {
            path: ':id',
            name: 'client-detail',
            component: () => import('src/components/ss-clients/SsClientDetail.vue'),
          },
        ],
      },
      {
        path: 'deliveries',
        name: 'deliveries',
        component: () => import('src/components/ss-deliveries/SsDeliveries.vue'),
        meta: { requiresAuth: true, role: 'Carrier' },
      },
      {
        path: 'routes',
        name: 'routes',
        component: () => import('src/components/ss-routes/SsRoutes.vue'),
        meta: { requiresAuth: true, role: 'Carrier' },
      },
      {
        path: 'vehicles',
        name: 'vehicles',
        component: () => import('src/components/ss-vehicles/SsVehicles.vue'),
        meta: { requiresAuth: true, role: 'Carrier' },
      },
      {
        path: 'drivers',
        name: 'drivers',
        component: () => import('src/components/ss-drivers/SsDrivers.vue'),
        meta: { requiresAuth: true, role: 'Carrier' },
      },
      {
        path: 'managers',
        name: 'managers',
        component: () => import('src/components/ss-managers/SsManagers.vue'),
        meta: { requiresAuth: true, role: 'Carrier' },
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
