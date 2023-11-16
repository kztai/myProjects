import type { RouteConfig } from 'vue-router'
import IconJtNavKnowledge from '~icons/jt/nav-knowledge'
import ClassicalLayout from '@/components/layouts/ClassicalLayout/index.vue'

export const knowledgeRoutes: RouteConfig[] = [
  {
    path: '/knowledge',
    name: 'Knowledge',
    redirect: '/knowledge/list',
    component: ClassicalLayout,
    meta: {
      title: '知识管理',
      asideMenu: true,
      asideIcon: IconJtNavKnowledge,
      breadcrumb: true,
    },
    children: [
      {
        path: '/knowledge/list',
        name: 'KnowledgeList',
        component: () => import('@/views/knowledge/list.vue'),
        meta: {
          title: '知识列表',
          asideMenu: true,
          breadcrumb: true,
        },
      },
      {
        path: '/knowledge/detail/:id',
        name: 'KnowledgeDetail',
        component: () => import('@/views/knowledge/detail.vue'),
        meta: {
          title: '知识详情',
          breadcrumb: true,
        },
      },
    ],
  },
]
