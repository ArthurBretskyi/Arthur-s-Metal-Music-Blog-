<template>
    <div class="user-menu" ref="menuRef">
        <button class="user-menu__trigger" @click="toggleDropdown" type="button">
            <img v-if="photoURL" :src="photoURL" :alt="displayName" class="user-menu__avatar" />
            <span v-else class="user-menu__initials">{{ initials }}</span>
        </button>

        <Transition name="dropdown">
            <div v-if="isOpen" class="user-menu__dropdown">
                <div class="user-menu__info">
                    <span class="user-menu__name">{{ displayName }}</span>
                    <span class="user-menu__email">{{ email }}</span>
                </div>
                <button class="user-menu__logout" @click="onLogout" type="button">
                    Вийти
                </button>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { onClickOutside } from '@vueuse/core'

const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { logout } = authStore

const isOpen = ref(false)
const menuRef = ref(null)

onClickOutside(menuRef, () => { isOpen.value = false })

function toggleDropdown() {
    isOpen.value = !isOpen.value
}

const photoURL = computed(() => user.value?.photoURL || null)

const displayName = computed(() => {
    return user.value?.displayName
        || user.value?.email?.split('@')[0]
        || 'User'
})

const email = computed(() => user.value?.email || '')

const initials = computed(() => displayName.value.charAt(0).toUpperCase())

async function onLogout() {
    await logout()
    isOpen.value = false
    router.push({ name: 'Home' })
}
</script>

<style lang="scss" scoped>
.user-menu {
    position: relative;

    &__trigger {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer;
        border: 2px solid transparent;
        transition: $transition;
        @include flex-center;

        &:hover {
            border-color: $accent-color;
        }
    }

    &__avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &__initials {
        font-size: $sm;
        font-weight: 600;
        color: $background-color;
        background-color: $accent-color;
        width: 100%;
        height: 100%;
        @include flex-center;
    }

    &__dropdown {
        position: absolute;
        top: calc(100% + 12px);
        right: 0;
        min-width: 220px;
        background-color: $cards-background-color;
        border: 1px solid color.adjust($cards-background-color, $lightness: 8%);
        box-shadow: 0 2px 8px $second-color;
        border-radius: $border-radius;
        overflow: hidden;
        z-index: 100;
    }

    &__info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: $spacing-md;
        border-bottom: 1px solid color.adjust($cards-background-color, $lightness: 8%);
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

    &__logout {
        display: block;
        width: 100%;
        padding: $spacing-md;
        text-align: left;
        font-size: $sm;
        color: $decor-color;
        transition: $transition;

        &:hover {
            background-color: color.adjust($cards-background-color, $lightness: 4%);
        }
    }
}

.dropdown-enter-active,
.dropdown-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>