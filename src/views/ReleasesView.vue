<template>
    <div class="releases">
        <div class="releases__container">
            <GenreFilter :genres="genreNames" @searchByGenre="onGenreSelect" />
            <ReleaseList :releases="visibleItems" />
            <div ref="sentinelRef" class="sentinel"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import ReleaseList from '@/components/ReleaseList.vue'
import GenreFilter from '@/components/GenreFilter.vue'
import { useReleasesStore } from '@/stores/releases'
import { useGenresStore } from '@/stores/genres'
import { usePagination } from '@/composables/usePagination'

const releasesStore = useReleasesStore()
const genresStore = useGenresStore()

const { getItemsList: releases } = storeToRefs(releasesStore)
const { getItemsList: genres } = storeToRefs(genresStore)


const genreNames = computed(() => genres.value.map(g => g.name))

const selectedGenre = ref(null)

const sortedReleases = computed(() => {
    return [...releases.value].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
    })
})

const filteredReleases = computed(() => {
    if (!selectedGenre.value) return sortedReleases.value
    return sortedReleases.value.filter(r => r.genre.includes(selectedGenre.value))
})

const { visibleItems, loadMore, hasMore } = usePagination(filteredReleases)

function onGenreSelect(genre) {
    selectedGenre.value = genre
}

const sentinelRef = ref(null)
let observer = null
onMounted(async () => {
    if (!releasesStore.getItemsList.length) await releasesStore.loadItemsList()
    if (!genresStore.getItemsList.length) await genresStore.loadItemsList()

    observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore.value) {
            loadMore()
        }
    }, { rootMargin: '200px' })

    observer.observe(sentinelRef.value)
})

onUnmounted(() => {
    observer?.disconnect()
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

    .sentinel {
        height: 1px;
    }
}
</style>