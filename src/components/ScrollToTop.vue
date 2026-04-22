<template>
    <Transition name="scroll-top">
        <button v-if="isVisible" class="scroll-top" type="button" aria-label="Scroll to top" @click="scrollToTop">
            ↑
        </button>
    </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()

const THRESHOLD = 300

const isVisible = computed(() => y.value > THRESHOLD)

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
.scroll-top {
    position: fixed;
    bottom: $spacing-lg;
    right: $spacing-lg;
    z-index: 50;

    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid $second-color;
    background: $cards-background-color;
    color: $accent-color;
    font-size: $lg;
    cursor: pointer;
    transition: $transition;

    @include flex-center;

    &:hover {
        border-color: $accent-color;
        background: $accent-color;
        color: $background-color;
    }
}

.scroll-top-enter-active,
.scroll-top-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.scroll-top-enter-from,
.scroll-top-leave-to {
    opacity: 0;
    transform: translateY(12px);
}
</style>