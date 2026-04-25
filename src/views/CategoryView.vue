<template>
    <div class="category__container">
        <ReleaseList :releases="filteredReleases" />
    </div>
    <div class="no-release" v-if="filteredReleases.length === 0">
        No releases found for this genre.
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed, onMounted } from 'vue';
import { useReleasesStore } from '@/stores/releases';
import ReleaseList from '@/components/ReleaseList.vue';
import { storeToRefs } from 'pinia';

const route = useRoute()
const searchingGenre = route.params.genre

const releasesStore = useReleasesStore()
const { getItemsList: releases } = storeToRefs(releasesStore)

const filteredReleases = computed(() => {
    if (!searchingGenre) return releases.value
    return releases.value.filter((release) => release.genre.includes(searchingGenre))
})

onMounted(() => {
    if (!releasesStore.getItemsList.length) releasesStore.loadItemsList()
})
</script>

<style lang="scss" scoped>
.category {

    &__container {}
}

.no-release {
    display: flex;
    align-items: center;
    justify-content: center;

}
</style>