<template>
    <button class="burger" @click="emit('toggle-menu')">
        <div class="burger__lines">
            <span class="burger__line"></span>
            <span class="burger__line"></span>
            <span class="burger__line"></span>
        </div>
    </button>
</template>

<script setup>
const emit = defineEmits(['toggle-menu'])
</script>

<style lang="scss" scoped>
.burger {
    gap: 0.8rem;
    background: none;
    border: none;
    cursor: pointer;
    color: $accent-color;
    @include flex-center;

    @media(min-width: $bp-tablet) {
        display: none;

    }

    &__lines {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 1.4rem;
    }

    &__line {
        display: block;
        width: 1.8rem;
        height: 2px;
        background-color: $accent-color;
        border-radius: 2px;
    }
}
</style>