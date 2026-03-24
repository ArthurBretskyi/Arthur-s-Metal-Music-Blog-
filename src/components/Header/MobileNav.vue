<template>
    <div class="mobile-nav">
        <div class="mobile-nav__container">
            <button class="mobile-nav__close-btn" @click="emit('close')">✕</button>
            <nav class="mobile-nav__menu menu-mobile">
                <ul class="menu-mobile__list">
                    <li class="menu-mobile__item"><router-link @click="emit('close')" :to="{ name: 'Home' }"
                            class="menu-mobile__link">Home</router-link>
                    </li>
                    <li class="menu-mobile__item"><router-link @click="emit('close')" :to="{ name: 'About' }"
                            class="menu-mobile__link">About</router-link>
                    </li>
                    <li class="menu-mobile__item"><router-link @click="emit('close')" :to="{ name: 'Admin' }"
                            class="menu-mobile__link">Admin</router-link>
                    </li>
                </ul>
            </nav>
            <div class="menu-mobile__actions actions-mobile">
                <button class="actions-mobile__register">Register</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['close'])
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
</style>