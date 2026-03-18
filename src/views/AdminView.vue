<template>
    <div class="admin__container">
        <form @submit.prevent="onSubmit" class="admin__form">
            <label for="band">Band:</label>
            <input type="text" id="band" v-model="newRelease.band">

            <label for="album">Album:</label>
            <input type="text" id="album" v-model="newRelease.album">

            <label for="label">Label:</label>
            <input type="text" id="label" v-model="newRelease.label">

            <div v-for="genre in availableGenres" :key="genre">
                <input type="checkbox" :id="genre" v-model="newRelease.genre" :value="genre">
                <label :for="genre">{{ genre }}</label>
            </div>

            <label for="new-genre">Add New Genre:</label>
            <input type="text" id="new-genre" v-model="newGenre">
            <button @click="addNewGenre">Add New Genre</button>

            <label for="date">Date:</label>
            <input type="text" id="date" v-model="newRelease.date">

            <label for="description">Description:</label>
            <textarea id="description" rows="5" cols="33" v-model="newRelease.description">\m/...\m/</textarea>

            <button type="submit">Add Release</button>
        </form>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useReleasesStore } from '@/stores/releases';
import { storeToRefs } from 'pinia';

const store = useReleasesStore()
const { availableGenres } = storeToRefs(store)
const { addNewRelease, addGenre } = store

const newRelease = reactive({
    band: '',
    album: '',
    label: '',
    genre: [],
    date: '',
    description: ''
})

const newGenre = ref('')

function onSubmit() {
    addNewRelease(newRelease)
    newRelease.band = '',
        newRelease.album = ''
    newRelease.label = ''
    newRelease.genre = []
    newRelease.date = ''
    newRelease.description = ''
}

function addNewGenre() {
    addGenre(newGenre.value)
    newGenre.value = ''
}

</script>

<style lang="scss" scoped></style>