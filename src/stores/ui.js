import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const isMenuOpen = ref(false)
  const isAuthModalOpen = ref(false)

  function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
  }

  function toggleAuthModal() {
    isAuthModalOpen.value = !isAuthModalOpen.value
  }

  return { isMenuOpen, isAuthModalOpen, toggleMenu, toggleAuthModal }
})
