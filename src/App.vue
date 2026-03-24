<template>
  <div class="wrapper">
    <AppHeader />
    <main class="main">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '@/components/Header/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
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
