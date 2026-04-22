<template>
  <div class="wrapper">
    <AppHeader />
    <main class="main">
      <router-view />
    </main>
    <Transition>
      <AuthModal v-if="isAuthModalOpen" />
    </Transition>
    <ScrollToTop />
  </div>
  <AppFooter />
</template>

<script setup>
import AppHeader from '@/components/Header/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import AuthModal from './components/Auth/AuthModal.vue';
import ScrollToTop from '@/components/ScrollToTop.vue'
import { useUiStore } from './stores/ui';
import { storeToRefs } from 'pinia';

const uiStore = useUiStore()
const { isAuthModalOpen } = storeToRefs(uiStore)
</script>

<style scoped>
.wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: clip;
}

.wrapper>main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
</style>
