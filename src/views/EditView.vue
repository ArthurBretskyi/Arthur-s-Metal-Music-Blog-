<template>
    <div class="edit__container">
        <div v-if="isLoading" class="edit__loading">Loading...</div>
        <div v-else-if="!currentRelease" class="edit__not-found">Release not found.</div>
        <form v-else @submit.prevent="onSubmit" class="edit__form">
            <label class="edit__label" for="band">Band:</label>
            <input class="edit__input" type="text" id="band" v-model="releaseToEdit.band">

            <label class="edit__label" for="album">Album:</label>
            <input class="edit__input" type="text" id="album" v-model="releaseToEdit.album">

            <label class="edit__label" for="label">Label:</label>
            <input class="edit__input" type="text" id="label" v-model="releaseToEdit.label">

            <div v-for="genre in genreNames" :key="genre" class="genre-item">
                <input class="genre-item__input" type="checkbox" :id="genre" v-model="releaseToEdit.genre" :value="genre">
                <span class="genre-item__box"></span>
                <label class="genre-item__label" :for="genre">{{ genre }}</label>
            </div>

            <label class="edit__label" for="date">Date:</label>
            <input class="edit__input" type="text" id="date" v-model="releaseToEdit.date">

            <label class="edit__label" for="description">Description:</label>
            <textarea class="edit__textarea" id="description" rows="5" cols="33"
                v-model="releaseToEdit.description">\m/...\m/</textarea>

            <label class="edit__label">Rating</label>
            <StarRating v-model="releaseToEdit.rating" />

            <button class="edit__btn" type="submit">Save</button>
        </form>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useReleasesStore } from '@/stores/releases'
import { useGenresStore } from '@/stores/genres'
import { useGeneralStore } from '@/stores/general'
import { storeToRefs } from 'pinia'
import { reactive, computed, onMounted, watch } from 'vue'
import StarRating from '@/components/StarRating.vue'

const route = useRoute()
const router = useRouter()

const releasesStore = useReleasesStore()
const genresStore = useGenresStore()
const generalStore = useGeneralStore()

const { getCurrentItem: currentRelease } = storeToRefs(releasesStore)
const { getItemsList: genres } = storeToRefs(genresStore)
const { isLoading } = storeToRefs(generalStore)

const genreNames = computed(() => genres.value.map(g => g.name))
const { updateRelease } = releasesStore

const searchingId = route.params.id

const releaseToEdit = reactive({
    band: '',
    album: '',
    label: '',
    genre: [],
    date: '',
    description: '',
    rating: 0,
})

// Коли currentRelease завантажиться — заповнюємо форму
watch(currentRelease, (release) => {
    if (!release) return
    releaseToEdit.band = release.band
    releaseToEdit.album = release.album
    releaseToEdit.label = release.label
    releaseToEdit.genre = [...release.genre]
    releaseToEdit.date = release.date
    releaseToEdit.description = release.description
    releaseToEdit.rating = release.rating ?? 0
}, { immediate: true })

async function onSubmit() {
    await updateRelease(searchingId, releaseToEdit)
    router.push({ name: 'Release', params: { id: searchingId } })
}

onMounted(() => {
    releasesStore.loadItemById(searchingId)
    if (!genresStore.getItemsList.length) genresStore.loadItemsList()
})
</script>


<style lang="scss" scoped>
.edit {

    &__container {
        display: flex;
        justify-content: center;
        padding: $spacing-lg $spacing-md;
    }

    &__form {
        width: 100%;
        max-width: 520px;
        background-color: $cards-background-color;
        border: 1px solid color.adjust($cards-background-color, $lightness: 8%);
        border-radius: $border-radius * 2;
        padding: $spacing-lg;
        display: flex;
        flex-direction: column;
        gap: $spacing-md;
    }

    &__label {
        font-size: $sm;
        font-weight: 500;
        color: $second-color;
        letter-spacing: 0.03em;
    }

    &__input,
    &__textarea {
        width: 100%;
        background-color: $background-color;
        border: 1px solid color.adjust($cards-background-color, $lightness: 8%);
        border-radius: $border-radius;
        color: $main-color;
        font-family: $main-font;
        font-size: $base-size;
        font-weight: $font-weight;
        padding: 0 $spacing-md;
        height: 40px;
        outline: none;
        transition: $transition;

        &::placeholder {
            color: $second-color;
            opacity: 0.5;
        }

        &:focus {
            border-color: $accent-color;
        }
    }

    &__textarea {
        height: auto;
        padding: $spacing-sm $spacing-md;
        resize: vertical;
    }

    &__btn {
        @include form-btn($cards-background-color,
            $border-radius,
            $second-color,
            $main-font,
            $sm,
            $spacing-md,
            $transition,
            $accent-color )
    }
}

.genre-item {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm 0;
    border-bottom: 1px solid color.adjust($cards-background-color, $lightness: 15%);
    cursor: pointer;

    &:last-of-type {
        border-bottom: none;
    }

    &__input {
        display: none;
    }

    &__box {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        border: 1px solid color.adjust($cards-background-color, $lightness: 15%);
        border-radius: 4px;
        background-color: $background-color;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: $transition;

        &::after {
            content: '';
            display: none;
            width: 5px;
            height: 9px;
            border-right: 2px solid $background-color;
            border-bottom: 2px solid $background-color;
            transform: rotate(45deg) translate(-1px, -1px);
        }
    }

    &__input:checked+&__box {
        background-color: $accent-color;
        border-color: $accent-color;

        &::after {
            display: block;
        }
    }

    &__label {
        font-size: $base-size;
        font-weight: $font-weight;
        color: $second-color;
        cursor: pointer;
        transition: $transition;
    }

    &__input:checked~&__label {
        color: $main-color;
    }
}
</style>