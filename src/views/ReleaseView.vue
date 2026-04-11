<template>
    <div class="release">
        <div class="release__container">
            <div v-if="!currentRelease" class="no-release">
                No such release.
            </div>
            <div v-else class="release__info">
                <div class="release__image">
                    <img :src="currentRelease.cover || ''" alt="album cover" class="release__img">
                </div>
                <h2 class="release__band">{{ currentRelease.band }}</h2>
                <h3 class="release__album">{{ currentRelease.album }}</h3>
                <span class="release__label">{{ currentRelease.label }}</span>
                <span class="release__date">{{ currentRelease.date }}</span>
                <span class="release__genre">{{ currentRelease.genre.join(', ') }}</span>
                <p class="release__description">{{ currentRelease.description }}</p>
                <router-link :to="{ name: 'Edit', params: { id: currentRelease.id } }">Edit Release</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useReleasesStore } from '@/stores/releases';
import { computed } from 'vue'
import { storeToRefs } from 'pinia';

const route = useRoute()

const store = useReleasesStore()
const { getItemsList: releases } = storeToRefs(store)

const searchingId = route.params.id
const currentRelease = computed(() =>
    releases.value.find((release) => release.id === searchingId)
)
</script>

<style lang="scss" scoped>
.release {
    min-height: calc(100vh - $header-height);
    background-color: $background-color;
    padding: $spacing-lg $spacing-md;

    &__container {
        max-width: 800px;
        margin: 0 auto;
    }

    &__info {
        display: grid;
        grid-template-columns: 280px 1fr;
        grid-template-rows: auto auto auto auto 1fr;
        gap: $spacing-md $spacing-lg;
        align-items: start;
    }

    &__image {
        grid-column: 1;
        grid-row: 1 / 6;
    }

    &__img {
        width: 100%;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        border-radius: $border-radius;
        background-color: $cards-background-color;
        display: block;
    }

    &__band {
        font-size: $xl;
        font-weight: 700;
        color: $main-color;
        margin: 0;
        align-self: end;
    }

    &__album {
        font-size: $lg;
        font-weight: $font-weight;
        color: $second-color;
        margin: 0;
    }

    &__label {
        font-size: $sm;
        color: $second-color;
    }

    &__date {
        font-size: $sm;
        color: $accent-color;
        font-weight: 500;
    }

    &__genre {
        font-size: $sm;
        color: $second-color;
        border-left: 2px solid $accent-color;
        padding-left: $spacing-sm;
    }

    &__description {
        grid-column: 1 / 3;
        color: $main-color;
        font-size: $base-size;
        font-weight: $font-weight;
        line-height: 1.7;
        margin: 0;
        padding-top: $spacing-md;
        border-top: 1px solid $cards-background-color;
    }
}

.no-release {
    color: $second-color;
    font-size: $lg;
    text-align: center;
    padding: $spacing-lg;
}
</style>