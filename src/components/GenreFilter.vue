<template>
    <div class="filter__container">
        <div class="filter__actions">
            <h2 class="filter__title">Choose a release by genre</h2>
            <button v-for="genre in genres" :key="genre" @click="onGenreClick(genre)" class="filter__button">{{
                genre }}</button>
        </div>

    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
    genres: {
        type: Array,
        required: true
    }
})

const router = useRouter()
function onGenreClick(genre) {
    emit('searchByGenre', genre)
    router.push({ name: 'Category', params: { genre } })

}

const emit = defineEmits(['searchByGenre'])
</script>

<style lang="scss" scoped></style>