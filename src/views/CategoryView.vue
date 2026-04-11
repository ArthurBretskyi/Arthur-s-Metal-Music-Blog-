<template>
    <div class="category__container">
        <ReleaseList :releases="filteredReleases" />
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useReleasesStore } from '@/stores/releases';
import ReleaseList from '@/components/ReleaseList.vue';
import { storeToRefs } from 'pinia';

const route = useRoute()
const searchingGenre = route.params.genre

const store = useReleasesStore()
const { getItemsList: releases } = storeToRefs(store)

const filteredReleases = computed(() => {
    if (!searchingGenre) return releases.value
    return releases.value.filter((release) => release.genre.includes(searchingGenre))
})
</script>

<style lang="scss" scoped></style>