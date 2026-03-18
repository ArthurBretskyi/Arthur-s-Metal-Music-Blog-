<template>
    <div class="release__container">
        <div v-if="!currentRelease" class="no-release">
            No such release.
        </div>
        <div v-else class="release__info">
            <div class="release__image">
                <img src="" alt="album cover" class="release__img">
            </div>
            <h2 class="release__band">{{ currentRelease.band }}</h2>
            <h3 class="release__album">{{ currentRelease.album }}</h3>
            <span class="release__label">{{ currentRelease.label }}</span>
            <span class="release__date">{{ currentRelease.date }}</span>
            <span class="release__genre">{{ currentRelease.genre.join(', ') }}</span>
            <p class="release__description">{{ currentRelease.description }}</p>
        </div>
        <router-link :to="{ name: 'Edit', params: { id: currentRelease.id } }">Edit Release</router-link>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useReleasesStore } from '@/stores/releases';
import { storeToRefs } from 'pinia';

const route = useRoute()

const store = useReleasesStore()
const { releases } = storeToRefs(store)

const searchingId = route.params.id
const currentRelease = releases.value.find((release) => release.id === searchingId)
</script>

<style lang="scss" scoped></style>