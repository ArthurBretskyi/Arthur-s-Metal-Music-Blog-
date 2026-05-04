<template>
    <div class="admin-user">

        <div v-if="!profileUser" class="admin-user__state">Loading...</div>

        <template v-else>
            <div class="admin-user__action">
                <RouterLink :to="{ name: 'AdminUsers' }" class="admin-users__back">← Back</RouterLink>
            </div>
            <div class="admin-user__header">
                <div class="admin-user__avatar">
                    <img v-if="photoURL" :src="photoURL" :alt="displayName" class="admin-user__avatar-img" />
                    <span v-else class="admin-user__avatar-initials">{{ initials }}</span>
                </div>
                <div class="admin-user__info">
                    <h2 class="admin-user__name">{{ displayName }}</h2>
                    <span class="admin-user__email">{{ profileUser?.email }}</span>
                </div>
            </div>



            <div class="admin-user__tabs">
                <button class="admin-user__tab" :class="{ 'admin-user__tab--active': activeTab === 'releases' }"
                    @click="setTab('releases')" type="button">
                    Releases
                </button>
                <button class="admin-user__tab" :class="{ 'admin-user__tab--active': activeTab === 'comments' }"
                    @click="setTab('comments')" type="button">
                    Comments
                </button>
            </div>
            <ProfileReleases v-if="activeTab === 'releases' && profileUser" :userId="profileUser.id" />
            <ProfileComments v-if="activeTab === 'comments' && profileUser" :userId="profileUser.id" />
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import { useGeneralStore } from '@/stores/general'
import { storeToRefs } from 'pinia'
import ProfileReleases from '@/views/Profile/ProfileReleases.vue'
import ProfileComments from '@/views/Profile/ProfileComments.vue'

const router = useRouter()
const route = useRoute()

const userId = route.params.id;
const profileUser = ref(null)

const usersStore = useUsersStore()
const { getUserByUID } = usersStore

const photoURL = computed(() => profileUser.value?.photoURL || null)

const displayName = computed(() =>
    profileUser.value?.firstName || profileUser.value?.displayName || profileUser.value?.email?.split('@')[0] || 'User'
)

const initials = computed(() => displayName.value.charAt(0).toUpperCase())

const activeTab = computed(() => route.query.tab || 'releases')

function setTab(tab) {
    router.replace({ query: { tab } })
}

onMounted(async () => {
    profileUser.value = await usersStore.getUserByUID(userId)
})

</script>

<style lang="scss" scoped>
.admin-user {
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

}
</style>