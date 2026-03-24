<template>
    <div class="home__container">
        <LightningHero />
    </div>
</template>

<script setup>
import LightningHero from './LightningHero.vue';
</script>

<style lang="scss" scoped>
.home__container {
    flex-grow: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
}
</style>