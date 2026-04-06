<template>
    <header class="header">
        <div class="header__container container">
            <div class="header__left">
                <h2 class="header__title">mAss</h2>
            </div>
            <div class="header__center">
                <nav class="header__menu menu">
                    <div class="menu__body">
                        <ul class="menu__list">
                            <li class="menu__item"><router-link :to="{ name: 'Home' }" class="menu__link">Home</router-link>
                            </li>
                            <li class="menu__item"><router-link :to="{ name: 'About' }"
                                    class="menu__link">About</router-link>
                            </li>
                            <li class="menu__item"><router-link :to="{ name: 'Releases' }"
                                    class="menu__link">Releases</router-link>
                            </li>
                            <li class="menu__item"><router-link :to="{ name: 'Admin' }"
                                    class="menu__link">Admin</router-link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            <div class="header__right">
                <div class="header__actions actions-header">
                    <button @click="toggleAuthModal" class="actions-header__register">Register</button>
                </div>
            </div>
            <BurgerMenu @toggle-menu="toggleMenu" />
            <Transition name="slide">
                <MobileNav v-if="isMenuOpen" @close="toggleMenu" />
            </Transition>
        </div>
    </header>
</template>

<script setup>
import BurgerMenu from '@/components/Header/BurgerMenu.vue';
import MobileNav from '@/components/Header/MobileNav.vue'
import { useUiStore } from '@/stores/ui';
import { storeToRefs } from 'pinia';

const store = useUiStore()
const { isMenuOpen, isAuthModalOpen } = storeToRefs(store)
const { toggleMenu, toggleAuthModal } = store

</script>

<style lang="scss">
.header {
    position: relative;
    z-index: 10;
    box-shadow: 0 2px 8px $second-color;

    &__container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        column-gap: 35px;
        min-height: 96px;
        padding-block: 1rem;
    }

    &__left {}

    &__title {
        font-size: $xxl;
        background-image: url("@/assets/pictures/fire.jpg");
        background-size: cover;
        background-position: center;

        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        -webkit-text-stroke: 0.4px $main-color;
    }

    &__center {
        display: none;

        @media(min-width: $bp-tablet) {
            display: flex;
        }
    }

    &__menu {}

    &__right {
        display: none;

        @media(min-width: $bp-tablet) {
            display: flex;
        }
    }

    &__actions {}
}

.container {}

.menu {

    &__body {}

    &__list {
        display: flex;
        justify-content: flex-end;
        column-gap: 35px;
        flex-wrap: wrap;
    }

    &__item {
        color: $accent-color;
    }

    &__link {
        font-size: $base-size;
        line-height: 1.62;
        color: $accent-color;
        padding-block-end: .25rem;
        transition: $transition;
        @include underline-hover($decor-color);

        &:hover {
            color: $main-color;
        }
    }
}

.actions-header {

    &__register {
        position: relative;
        border: none;
        border-radius: .25rem;
        padding-block-end: .25rem;
        transition: $transition;
        @include underline-hover($decor-color);

        &:hover {
            color: $accent-color;
        }
    }
}

/* AppHeader.vue — глобально або без scoped */
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from {
    // початковий стан (перед появою)
    transform: translateX(100%);
}

.slide-enter-to {
    // кінцевий стан (після появи)
    transform: translateX(0);
}

.slide-leave-from {
    // початковий стан (перед зникненням)
    transform: translateX(0);
}

.slide-leave-to {
    // кінцевий стан (після зникнення)
    transform: translateX(100%);
}
</style>