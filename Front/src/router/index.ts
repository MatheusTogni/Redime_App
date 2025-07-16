import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/index.vue')
  },
  {
    path: '/biblia',
    name: 'Biblia',
    component: () => import('../pages/biblia.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../pages/about.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
