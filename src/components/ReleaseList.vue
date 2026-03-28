<template>
    <div class="list">
        <div class="list__container">
            <ReleaseCard v-for="release in releases" :key="release.id" :release="release" />
        </div>
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

<style lang="scss" scoped>
.list {
    padding: $spacing-lg 0;

    &__container {
        display: grid;
        grid-template-columns: 1fr;
        gap: $spacing-md;

        @media (min-width: $bp-tablet) {
            grid-template-columns: repeat(4, 1fr);
            gap: $spacing-lg;
        }
    }
}
</style>