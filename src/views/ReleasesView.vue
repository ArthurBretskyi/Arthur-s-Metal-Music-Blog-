<template>
    <div class="releases">
        <div class="releases__container">
            <GenreFilter :genres="genreNames" @searchByGenre="onGenreSelect" />
            <ReleaseList :releases="filteredReleases" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import ReleaseList from '@/components/ReleaseList.vue'
import GenreFilter from '@/components/GenreFilter.vue'
import { useReleasesStore } from '@/stores/releases'
import { useGenresStore } from '@/stores/genres'

const releasesStore = useReleasesStore()
const genresStore = useGenresStore()

const { getItemsList: releases } = storeToRefs(releasesStore)
const { getItemsList: genres } = storeToRefs(genresStore)

const genreNames = computed(() => genres.value.map(g => g.name))

const selectedGenre = ref(null)
const filteredReleases = computed(() => {
    if (!selectedGenre.value) return releases.value
    return releases.value.filter(r => r.genre.includes(selectedGenre.value))
})

function onGenreSelect(genre) {
    selectedGenre.value = genre
}

onMounted(() => {
    if (!releasesStore.getItemsList.length) releasesStore.loadItemsList()
    if (!genresStore.getItemsList.length) genresStore.loadItemsList()
})
</script>

<style lang="scss" scoped>
.releases {
    padding: $spacing-lg 0;

    &__container {
        display: flex;
        flex-direction: column;
        gap: $spacing-lg;
    }
}
</style>