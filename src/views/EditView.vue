<template>
    <div class="edit__container">
        <form @submit.prevent="onSubmit" class="admin__form">
            <label for="band">Band:</label>
            <input type="text" id="band" v-model="releaseToEdit.band">

            <label for="album">Album:</label>
            <input type="text" id="album" v-model="releaseToEdit.album">

            <label for="label">Label:</label>
            <input type="text" id="label" v-model="releaseToEdit.label">

            <div v-for="genre in availableGenres" :key="genre">
                <input type="checkbox" :id="genre" v-model="releaseToEdit.genre" :value="genre">
                <label :for="genre">{{ genre }}</label>
            </div>

            <label for="date">Date:</label>
            <input type="text" id="date" v-model="releaseToEdit.date">

            <label for="description">Description:</label>
            <textarea id="description" rows="5" cols="33" v-model="releaseToEdit.description">\m/...\m/</textarea>

            <button type="submit">Save</button>
        </form>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useReleasesStore } from '@/stores/releases';
import { storeToRefs } from 'pinia';
import { reactive } from 'vue'

const route = useRoute()
const router = useRouter()

const store = useReleasesStore()
const { releases } = storeToRefs(store)
const { updateRelease } = store

const searchingId = route.params.id
const currentRelease = releases.value.find((release) => release.id === searchingId)
const releaseToEdit = reactive({
    band: currentRelease.band,
    album: currentRelease.album,
    label: currentRelease.label,
    genre: [...currentRelease.genre],
    date: currentRelease.date,
    description: currentRelease.description
})

function onSubmit() {
    updateRelease(searchingId, releaseToEdit)
    router.push({ name: 'Release', params: { id: searchingId } })
}
</script>


<style lang="scss" scoped></style>