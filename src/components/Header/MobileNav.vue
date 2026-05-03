<template>
    <div class="mobile-nav">
        <div class="mobile-nav__container">
            <button class="mobile-nav__close-btn" @click="emit('close')">✕</button>
            <nav class="mobile-nav__menu menu-mobile">
                <ul class="menu-mobile__list">
                    <li class="menu-mobile__item"><router-link @click="emit('close')" :to="{ name: 'Home' }"
                            class="menu-mobile__link">{{ $t('components.MobileNav.home') }}</router-link>
                    </li>
                    <li class="menu-mobile__item"><router-link @click="emit('close')" :to="{ name: 'About' }"
                            class="menu-mobile__link">{{ $t('components.MobileNav.about') }}</router-link>
                    </li>
                    <li class="menu-mobile__item"><router-link @click="emit('close')" :to="{ name: 'Releases' }"
                            class="menu-mobile__link">{{ $t('components.MobileNav.releases') }}</router-link>
                    </li>
                    <li v-if="user" class="menu-mobile__item"><router-link @click="emit('close')"
                            :to="{ name: 'Add-Release' }" class="menu-mobile__link">{{
                                $t('components.MobileNav.add-release') }}</router-link>
                    </li>
                    <li v-if="isAdmin" class="menu-mobile__item"><router-link @click="emit('close')" :to="{ name: 'Admin' }"
                            class="menu-mobile__link">{{ $t('components.MobileNav.admin') }}</router-link>
                    </li>
                </ul>
            </nav>
            <div v-if="!user" class="menu-mobile__actions actions-mobile">
                <button @click="toggleAuthModal" class="actions-mobile__register">{{ $t('components.MobileNav.register')
                }}</button>
            </div>
            <div v-else class="menu-mobile__user user-menu">
                <div class="user-menu__init">
                    <img v-if="photoURL" :src="photoURL" :alt="displayName" class="user-menu__avatar" />
                    <span v-else class="user-menu__initials">{{ initials }}</span>
                </div>
                <div>
                    <div class="user-menu__info">
                        <span class="user-menu__name">{{ displayName }}</span>
                        <span class="user-menu__email">{{ email }}</span>
                    </div>
                    <div class="user-menu__actions">
                        <div class="user-menu__profile">
                            <router-link :to="{ name: 'Profile' }" @click="emit('close')" class="user-menu__profile-link">{{
                                $t('components.MobileNav.profile') }}</router-link>
                        </div>
                        <button class="user-menu__logout" @click="onLogout" type="button">
                            {{ $t('components.MobileNav.logOut') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const authStore = useAuthStore()
const { user, isAdmin } = storeToRefs(authStore)
const { logout } = authStore

const UiStore = useUiStore()
const { toggleAuthModal } = UiStore



const photoURL = computed(() => user.value?.photoURL || null)

const displayName = computed(() =>
    user.value?.firstName || user.value?.displayName || user.value?.email?.split('@')[0] || 'User'
)

const email = computed(() => user.value?.email || '')

const initials = computed(() => displayName.value.charAt(0).toUpperCase())

const emit = defineEmits(['close'])

async function onLogout() {
    await logout()
    emit('close')
    router.push({ name: 'Home' })
}

onMounted(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden' // це html елемент
})

onUnmounted(() => {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
})
</script>

<style lang="scss" scoped>
.mobile-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $cards-background-color;
    z-index: 100;
    overflow-y: auto;

    &__container {
        display: flex;
        flex-direction: column;
        padding: 2rem;
    }

    &__close-btn {
        align-self: flex-end;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
        color: $accent-color;
    }

    &__menu {
        margin-top: 2rem;
    }
}

.menu-mobile {
    margin-block-end: $spacing-lg;
    border-bottom: 2px solid color.adjust($cards-background-color, $lightness: 8%);


    &__list {
        display: flex;
        flex-direction: column;
        gap: $xl;
    }

    &__item {}

    &__link {
        font-size: $xl;
        line-height: 1.62;
        color: $accent-color;
    }

    &__actions {}

    &__user {}
}

.actions-mobile {
    padding-block-start: $xl;

    &__register {
        border: 1px solid $accent-color;
        color: $main-color;
        font-size: $xl;
        padding: .5rem;
        border-radius: .25rem;
    }
}

.user-menu {

    &__init {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
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

    &__info {
        display: flex;
        flex-direction: column;
        gap: 14px;
        margin-block-start: $spacing-md;
        margin-block-end: $spacing-md;
        padding-block-end: $spacing-md;
        border-bottom: 1px solid color.adjust($cards-background-color, $lightness: 8%);
    }

    &__name {
        font-size: $xl;
        font-weight: 500;
        color: $main-color;
    }

    &__email {
        font-size: $lg;
        color: $second-color;
    }

    &__actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    &__profile-link {
        font-size: $xl;
        font-weight: 500;
        color: $main-color;
    }

    &__logout {
        align-self: flex-start;
        @include form-btn($cards-background-color,
            $border-radius,
            $decor-color,
            $main-font,
            $sm,
            $spacing-md,
            $transition,
            $decor-color );
        color: $main-color;
        font-size: $lg;
        border-left: 1px solid $decor-color;
    }
}
</style>