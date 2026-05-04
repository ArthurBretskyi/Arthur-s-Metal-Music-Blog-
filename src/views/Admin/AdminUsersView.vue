<template>
    <div class="admin-users">
        <div class="admin-users__header">
            <RouterLink :to="{ name: 'Admin' }" class="admin-users__back">← Back</RouterLink>
            <h2 class="admin-users__title">Users</h2>
        </div>

        <div v-if="isLoading" class="admin-users__state">Loading...</div>

        <div v-else-if="!users.length" class="admin-users__state">No users found.</div>

        <div v-else class="admin-users__table">
            <div class="admin-users__row admin-users__row--head">
                <span>Username</span>
                <span>Email</span>
                <span>Role</span>
                <span>Joined</span>
            </div>
            <div v-for="user in users" :key="user.id" class="admin-users__row"
                @click="router.push({ name: 'AdminUserView', params: { id: user.id } })">
                <span class="admin-users__cell">{{ user.username || '—' }}</span>
                <span class="admin-users__cell">{{ user.email || '—' }}</span>
                <span class="admin-users__cell">
                    <span class="admin-users__badge" :class="{ 'admin-users__badge--admin': user.role === 'admin' }">
                        {{ user.role || 'user' }}
                    </span>
                </span>
                <span class="admin-users__cell admin-users__cell--date">
                    {{ formatDate(user.createdAt) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import { useGeneralStore } from '@/stores/general'

const router = useRouter()

const usersStore = useUsersStore()
const { getItemsList: users } = storeToRefs(usersStore)
const { isLoading } = storeToRefs(useGeneralStore())

function formatDate(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

onMounted(() => {
    if (!usersStore.getItemsList.length) usersStore.loadItemsList()
})
</script>

<style lang="scss" scoped>
.admin-users {
    width: 100%;

    &__header {
        display: flex;
        align-items: center;
        gap: $spacing-md;
        margin-bottom: $spacing-lg;
    }

    &__back {
        font-size: $sm;
        color: $second-color;
        transition: $transition;

        &:hover {
            color: $accent-color;
        }
    }

    &__title {
        font-size: $xl;
        font-weight: 500;
        color: $main-color;
    }

    &__state {
        font-size: $sm;
        color: $second-color;
        text-align: center;
        padding: $spacing-lg 0;
    }

    &__table {
        display: flex;
        flex-direction: column;
        border: 1px solid color.adjust($cards-background-color, $lightness: 8%);
        border-radius: $border-radius;
        overflow: hidden;
    }

    &__row {
        display: grid;
        grid-template-columns: 1.5fr 2fr 1fr 1.5fr;
        padding: $spacing-sm $spacing-md;
        border-bottom: 1px solid color.adjust($cards-background-color, $lightness: 5%);
        transition: $transition;

        &:last-child {
            border-bottom: none;
        }

        &--head {
            background-color: color.adjust($cards-background-color, $lightness: 4%);
            font-size: $sm;
            font-weight: 500;
            color: $second-color;
            text-transform: uppercase;
            letter-spacing: 0.06em;
        }

        &:not(&--head):hover {
            background-color: color.adjust($cards-background-color, $lightness: 3%);
        }

        &:not(&--head) {
            cursor: pointer;
        }
    }

    &__cell {
        font-size: $sm;
        color: $main-color;
        display: flex;
        align-items: center;

        &--date {
            color: $second-color;
        }
    }

    &__badge {
        display: inline-block;
        font-size: 0.7rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        padding: 2px $spacing-sm;
        border-radius: $border-radius;
        border: 1px solid $second-color;
        color: $second-color;

        &--admin {
            border-color: $accent-color;
            color: $accent-color;
        }
    }
}
</style>