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
        meta: {
          requiresAuth: true,
          roles: ['Client'],
        },
      },
    ],
  },

  {
    name: 'auth',
    path: '/auth',
    meta: {
      requiresAuth: false,
    },
    component: () => import('src/pages/auth/LoginPage.vue'),
  },

  {
    path: '/not-authorized',
    name: 'not-authorized',
    component: () => import('src/pages/NotAuthorized.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
