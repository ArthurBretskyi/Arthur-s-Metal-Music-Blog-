<template>
    <div class="profile">
        <div class="profile__container">

            <div class="profile__header">
                <div class="profile__avatar">
                    <img v-if="photoURL" :src="photoURL" :alt="displayName" class="profile__avatar-img" />
                    <span v-else class="profile__avatar-initials">{{ initials }}</span>
                </div>
                <div class="profile__info">
                    <h2 class="profile__name">{{ displayName }}</h2>
                    <span class="profile__email">{{ user.email }}</span>
                </div>
                <RouterLink :to="{ name: 'Profile-Edit' }" class="profile__edit-btn">
                    Edit profile
                </RouterLink>
            </div>

            <div class="profile__tabs">
                <button class="profile__tab" :class="{ 'profile__tab--active': activeTab === 'releases' }"
                    @click="setTab('releases')" type="button">
                    Releases
                </button>
                <button class="profile__tab" :class="{ 'profile__tab--active': activeTab === 'comments' }"
                    @click="setTab('comments')" type="button">
                    Comments
                </button>
            </div>

            <ProfileReleases v-if="activeTab === 'releases'" :userId="user.uid" />
            <ProfileComments v-if="activeTab === 'comments'" :userId="user.uid" />

            <div class="profile__danger-zone">
                <h3 class="profile__danger-title">Danger zone</h3>
                <p class="profile__danger-desc">
                    Permanently delete your account and all associated data.
                </p>
                <button class="profile__danger-btn" type="button" @click="onDeleteAccount">
                    Delete account
                </button>
            </div>

        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import ProfileReleases from '@/views/Profile/ProfileReleases.vue'
import ProfileComments from '@/views/Profile/ProfileComments.vue'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { deleteAccountAndUserDoc } = authStore

const photoURL = computed(() => user.value?.photoURL || null)

const displayName = computed(() =>
    user.value?.displayName || user.value?.email?.split('@')[0] || 'User'
)

const initials = computed(() => displayName.value.charAt(0).toUpperCase())

const activeTab = computed(() => route.query.tab || 'releases')

function setTab(tab) {
    router.replace({ query: { tab } })
}

async function onDeleteAccount() {
    const confirmed = confirm('Are you sure? This action cannot be undone.')
    if (!confirmed) return

    try {
        await deleteAccountAndUserDoc()
        router.push({ name: 'Home' })
    } catch (e) {
        if (e.message === 'requires-recent-login') {
            alert('For security, please log in again before deleting your account.')
        }
    }
}
</script>

<style lang="scss" scoped>
.profile {
    padding: $spacing-lg 0;

    &__container {
        max-width: 860px;
        display: flex;
        flex-direction: column;
        gap: $spacing-lg;
    }

    &__header {
        display: flex;
        align-items: center;
        gap: $spacing-md;
        padding: $spacing-md;
        background-color: $cards-background-color;
        border: 1px solid color.adjust($cards-background-color, $lightness: 8%);
        border-radius: $border-radius * 2;
    }

    &__avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;
        flex-shrink: 0;
        background-color: $accent-color;
        @include flex-center;
    }

    &__avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &__avatar-initials {
        font-size: $xl;
        font-weight: 500;
        color: $background-color;
    }

    &__info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    &__name {
        font-size: $base-size;
        font-weight: 500;
        color: $main-color;
    }

    &__email {
        font-size: $sm;
        color: $second-color;
    }

    &__edit-btn {
        @include form-btn($cards-background-color,
            $border-radius,
            $second-color,
            $main-font,
            $sm,
            $spacing-md,
            $transition,
            $accent-color );
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &__tabs {
        display: flex;
        border-bottom: 1px solid color.adjust($cards-background-color, $lightness: 8%);
    }

    &__tab {
        padding: $spacing-sm $spacing-md;
        font-family: $main-font;
        font-size: $sm;
        font-weight: 400;
        color: $second-color;
        background: transparent;
        border: none;
        border-bottom: 2px solid transparent;
        margin-bottom: -1px;
        cursor: pointer;
        transition: $transition;

        &:hover {
            color: $main-color;
        }

        &--active {
            color: $main-color;
            font-weight: 500;
            border-bottom-color: $accent-color;
        }
    }

    &__danger-zone {
        padding: $spacing-md;
        border: 1px solid $decor-color;
        border-radius: $border-radius * 2;
        display: flex;
        flex-direction: column;
        gap: $spacing-sm;
    }

    &__danger-title {
        font-size: $sm;
        font-weight: 500;
        color: $decor-color;
    }

    &__danger-desc {
        font-size: $sm;
        color: $second-color;
    }

    &__danger-btn {
        align-self: flex-start;
        @include form-btn($cards-background-color,
            $border-radius,
            $decor-color,
            $main-font,
            $sm,
            $spacing-md,
            $transition,
            $decor-color );
        border-color: $decor-color;
    }
}
</style>