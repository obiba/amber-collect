
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Dashboard.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/case-reports',
        component: () => import('pages/CaseReports.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/case-report/:id',
    component: () => import('src/pages/CaseReport.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/forgot-password',
    component: () => import('pages/ForgotPassword.vue')
  },
  {
    path: '/lock',
    component: () => import('pages/LockScreen.vue')
  },
  {
    path: '/loading',
    component: () => import('pages/Loading.vue')
  },
  {
    path: '/login',
    component: () => import('pages/Login.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
