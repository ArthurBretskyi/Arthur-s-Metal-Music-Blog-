<template>
    <div class="list__container">
        <ReleaseCard v-for="release in releases" :key="release.id" :release="release" />
    </div>
</template>

<script setup>
import ReleaseCard from './ReleaseCard.vue';
defineProps({
    releases: {
        type: Array,
        required: true,
    }
})
</script>

<style lang="scss" scoped></style>