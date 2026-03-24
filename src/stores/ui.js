import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const isMenuOpen = ref(false)

  function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
  }

  return { isMenuOpen, toggleMenu }
})
