<template>
  <div class="wrapper">
    <AppHeader />
    <div class="main">
      <router-view />
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<style scoped></style>
