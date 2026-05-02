import '@/assets/styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import i18n from '@/i18n'

import App from './App.vue'
import router from './router'

import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
app.use(createPinia())
app.use(i18n)

const authStore = useAuthStore()

authStore.initAuth().then(() => {
  app.use(router)
  app.mount('#app')
})
