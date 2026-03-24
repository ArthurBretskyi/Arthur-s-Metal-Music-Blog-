<template>
    <div class="releases">
        <div class="releases__container">
            <GenreFilter :genres="genres" @searchByGenre="onGenreSelect" />
            <ReleaseList :releases="filteredReleases" />
        </div>
    </div>
</template>

<script setup>
import ReleaseList from '@/components/ReleaseList.vue';
import { useReleasesStore } from '@/stores/releases';
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue'
import GenreFilter from '@/components/GenreFilter.vue';

const store = useReleasesStore()
const { releases } = storeToRefs(store)

const genres = computed(() => {
    // 1. витягую всі genre масиви з releases
    const allGenres = releases.value.map((release) => release.genre)
    // 2. роблю одновимірний масив
    const genresArr = allGenres.flat()
    // 3. алишаю унікальні значення
    const uniqueGenres = [...new Set(genresArr)]
    return uniqueGenres
})

const selectedGenre = ref(null)
const filteredReleases = computed(() => {
    if (!selectedGenre.value) return releases.value
    return releases.value.filter((release) => release.genre.includes(selectedGenre.value))
})
const onGenreSelect = (genre) => {
    selectedGenre.value = genre
}
</script>

<style lang="scss" scoped></style>