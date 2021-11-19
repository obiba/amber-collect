
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Dashboard.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/test',
    component: () => import('pages/Test.vue'),
    meta: {}
  },
  {
    path: '/loading',
    component: () => import('pages/Loading.vue')
  },
  {
    path: '/login',
    component: () => import('pages/Login.vue')
  },
  {
    path: '/lock',
    component: () => import('pages/LockScreen.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
