<template>
    <div class="filter">
        <div class="filter__container">
            <div class="filter__actions">
                <h2 class="filter__title">Choose a release by genre</h2>
                <button v-for="genre in genres" :key="genre" @click="onGenreClick(genre)" class="filter__button">{{
                    genre }}</button>
            </div>

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

<style lang="scss" scoped>
.filter {
    padding: $spacing-lg 0;

    &__actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: $spacing-sm + 2;
    }

    &__title {
        font-size: $sm;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: $main-color;
        margin: 0;
        width: 100%;

        @media (min-width: $bp-tablet) {
            width: auto;
        }
    }

    &__button {
        font-family: $main-font;
        font-size: $sm;
        font-weight: 500;
        letter-spacing: 0.04em;
        padding: 6px 18px;
        border-radius: 100px;
        border: 1px solid $second-color;
        background: transparent;
        color: $accent-color;
        cursor: pointer;
        transition: $transition;

        &:hover,
        &.active {
            background: $accent-color;
            color: $background-color;
        }
    }
}
</style>