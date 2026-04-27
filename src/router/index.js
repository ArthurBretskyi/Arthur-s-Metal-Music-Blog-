import { useAuthStore } from '@/stores/auth'

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ReleaseView from '@/views/ReleaseView.vue'
import CategoryView from '@/views/CategoryView.vue'
import AboutView from '@/views/AboutView.vue'
import AdminView from '@/views/Admin/AdminView.vue'
import EditView from '@/views/EditView.vue'
import ReleasesView from '@/views/ReleasesView.vue'
import AddReleaseView from '@/views/AddReleaseView.vue'
import AdminUsersView from '@/views/Admin/AdminUsersView.vue'

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
    children: [
      {
        path: 'users',
        name: 'AdminUsers',
        component: AdminUsersView,
        meta: { requiresAdmin: true },
      },
    ],
  },
  {
    path: '/admin/edit/:id',
    name: 'Edit',
    component: EditView,
    meta: { requiresAdmin: true },
  },
  {
    path: '/releases',
    name: 'Releases',
    component: ReleasesView,
  },
  {
    path: '/add-release',
    name: 'Add-Release',
    component: AddReleaseView,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next({ name: 'Home' })
  }

  if (to.meta.requiresAuth && !authStore.user) {
    return next({ name: 'Home' })
  }

  next()
})

export default router
