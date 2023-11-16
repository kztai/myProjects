import type { RouteConfig } from 'vue-router'
import IconJtNavPowerTest from '~icons/jt/nav-power-test'
// import ClassicalLayout from '@/components/layouts/ClassicalLayout/index.vue'

export const dashboardRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    component: () => import('@/views/cyfj/Homepage.vue'),
    meta: {
      title: 'dashboard',
      asideMenu: true,
      asideIcon: IconJtNavPowerTest,
      breadcrumb: true,
    },
    // children: [{
    //   path: '/dashboard',
    //   name: 'Dashboard',
    //   component: () => import('@/views/HomeView.vue'),
    // }],
  },
]
