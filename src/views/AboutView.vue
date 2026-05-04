<template>
    <div class="about">
        <div class="about__container">
            <div class="about-header">
                <div class="about-header__body">
                    <div class="about-header__image">
                        <img src="@/assets/pictures/about/horns_left.png" alt="devil horns left" class="about-header__img">
                    </div>
                    <h2 class="about-header__title">{{ $t("pages.About.title") }}</h2>
                    <div class="about-header__image">
                        <img src="@/assets/pictures/about/horns_right.png" alt="devil horns right"
                            class="about-header__img">
                    </div>
                </div>
            </div>
            <div class="about-main">
                <p v-for="(line, index) in $tm('pages.About.text')" :key="index" class="about-main__text">
                    {{ $rt(line) }}
                </p>
            </div>
            <div class="about-footer">
                <div v-if="!user" class="about-footer__actions">
                    <button @click="toggleAuthModal" class="about-footer__register">Join us</button>
                </div>
                <div v-else class="about-footer__welcome">
                    Welcome to the pit!
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const uiStore = useUiStore()
const { toggleAuthModal } = uiStore
</script>

<style lang="scss" scoped>
.about {
    padding: $spacing-lg $spacing-md;

    &__container {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
        align-items: center;
        justify-content: center;
    }
}

.about-header {
    display: flex;
    align-items: center;
    justify-content: center;

    &__body {
        max-width: 400px;
        width: 100%;
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 10px;
        border: 2px solid $accent-color;

        @media (min-width: $bp-tablet) {
            max-width: 600px;
            justify-content: space-between;
            padding: 20px;
        }
    }

    &__image {
        width: 100px;
        height: 100px;

        @media (min-width: $bp-tablet) {
            width: 200px;
            height: 200px;
        }
    }

    &__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &__title {
        text-align: center;
        font-size: $lg;

        @media (min-width: $bp-tablet) {
            @include title($xxl, $main-color);
        }
    }

}


.about-main {

    &__text {
        max-width: 400px;
        text-align: center;
        font-size: $sm;
        line-height: 1.7;

        @media (min-width: $bp-tablet) {
            font-size: $lg;
            max-width: 600px;
        }
    }
}

.about-footer {

    &__register {
        color: $accent-color;
        font-size: $lg;
        border: 1px solid $accent-color ;
        border-radius: $border-radius;
        padding: $spacing-sm;

        @media (min-width: $bp-tablet) {
            @include form-btn($cards-background-color,
                $border-radius,
                $second-color,
                $main-font,
                $sm,
                $spacing-md,
                $transition,
                $accent-color)
        }
    }

    &__welcome {
        color: $accent-color;
        font-size: $lg;

        @media (min-width: $bp-tablet) {
            font-size: $xxl;

        }
    }
}
</style>