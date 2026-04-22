<template>
    <div class="release">
        <div class="release__container">
            <div v-if="!currentRelease" class="no-release">
                No such release.
            </div>
            <div v-else class="release__body">
                <div class="release__image">
                    <img :src="currentRelease.cover || ''" alt="album cover" class="release__img">
                </div>
                <div class="release__info">
                    <h2 class="release__band">{{ currentRelease.band }}</h2>
                    <h3 class="release__album">{{ currentRelease.album }}</h3>
                    <span class="release__label">{{ currentRelease.label }}</span>
                    <span class="release__date">{{ currentRelease.date }}</span>
                    <span class="release__genre">{{ currentRelease.genre.join(', ') }}</span>
                    <p class="release__description">{{ currentRelease.description }}</p>
                    <div class="release__rating">
                        <StarRating :modelValue="currentRelease.rating ?? 0" :readonly="true" />
                    </div>
                    <div class="release__author">Author: {{ authorName }}</div>
                    <div class="release__action">
                        <router-link v-if="user && canEdit" class="release__edit"
                            :to="{ name: 'Edit', params: { id: currentRelease.id } }">
                            Edit Release
                        </router-link>
                    </div>
                </div>
            </div>
            <ReleaseComments class="release__comments" :releaseId="searchingId" />
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useReleasesStore } from '@/stores/releases';
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia';
import StarRating from '@/components/StarRating.vue';
import ReleaseComments from '@/components/Comments/ReleaseComments.vue'

const route = useRoute()

const releasesStore = useReleasesStore()
const { getItemsList: releases } = storeToRefs(releasesStore)

const authStore = useAuthStore()
const { user, isAdmin } = storeToRefs(authStore)

const usersStore = useUsersStore()
const { getUserByUID } = usersStore
const author = ref(null)
const authorName = computed(() => author.value?.firstName || 'Unknown')

const searchingId = route.params.id
const currentRelease = computed(() =>
    releases.value.find((release) => release.id === searchingId)
)

const canEdit = computed(() => {
    if (!currentRelease.value) return false
    if (isAdmin.value) return true
    return user.value?.uid === currentRelease.value.userId
})

onMounted(async () => {
    if (!releasesStore.getItemsList.length) await releasesStore.loadItemsList()
    if (currentRelease.value?.userId) {
        author.value = await getUserByUID(currentRelease.value.userId)
    }
})
</script>

<style lang="scss" scoped>
.release {
    min-height: calc(100vh - $header-height);
    background-color: $background-color;
    padding: $spacing-lg $spacing-md;

    &__container {
        max-width: 800px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    &__body {
        width: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 1.25rem;
        background-color: $cards-background-color;
        border: 1px solid color.adjust($cards-background-color, $lightness: 8%);
        padding: $spacing-md;
        border-radius: $border-radius;

        @media (min-width: $bp-tablet) {
            width: 100%;
            flex-direction: row;
            align-items: stretch;
            justify-content: start;
            text-align: left;
        }
    }

    &__info {
        display: flex;
        flex-direction: column;
        gap: .625rem;
    }

    &__image {
        height: 100%;
        max-width: 300px;
        width: 100%;
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
        padding-left: $spacing-sm;

        @media (min-width: $bp-tablet) {
            border-left: 2px solid $accent-color;

        }
    }

    &__description {
        color: $main-color;
        font-size: $base-size;
        font-weight: $font-weight;
        line-height: 1.7;
        margin: 0;
        padding-top: $spacing-md;
        border-top: 1px solid $cards-background-color;
    }

    &__rating {
        display: flex;
        justify-content: center;

        @media (min-width: $bp-tablet) {
            justify-content: start;
        }
    }

    &__action {
        display: flex;
        flex: 1;
        align-items: end;
        justify-content: center;
        margin-block-start: 20px;

        @media (min-width: $bp-tablet) {
            margin-block-start: 0px;
            justify-content: start;
        }
    }

    &__edit {
        display: flex;
        align-items: center;
        justify-content: center;
        // align-self: end;
        @include form-btn($cards-background-color,
            $border-radius,
            $second-color,
            $main-font,
            $sm,
            $spacing-md,
            $transition,
            $accent-color)
    }



    &__comments {
        width: 100%;
    }
}

.no-release {
    color: $second-color;
    font-size: $lg;
    text-align: center;
    padding: $spacing-lg;
}
</style>