import VueRouter, { type RouteConfig } from 'vue-router'
import BlankLayout from '@/components/layouts/BlankLayout/index.vue'
import { dashboardRoutes } from './dashboard'
import { knowledgeRoutes } from './knowledge'

export const classicalLayoutRoutes: RouteConfig[] = [
  ...dashboardRoutes,
  ...knowledgeRoutes,
]

const routes: RouteConfig[] = [
  {
    path: '',
    redirect: '/login',
    component: BlankLayout,
    children: [
      {
        path: 'login',
        component: () => import('@/views/auth/login.vue'),
      },
    ],
  },
  ...classicalLayoutRoutes,
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

export default router
