import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ReleaseView from '@/views/ReleaseView.vue'
import CategoryView from '@/views/CategoryView.vue'
import AboutView from '@/views/AboutView.vue'
import AdminView from '@/views/AdminView.vue'
import EditView from '@/views/EditView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/release/:id',
    name: 'Release',
    component: ReleaseView,
  },
  {
    path: '/category/:genre',
    name: 'Category',
    component: CategoryView,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAdmin: true },
  },
  {
    path: '/admin/edit/:id',
    name: 'Edit',
    component: EditView,
    meta: { requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
