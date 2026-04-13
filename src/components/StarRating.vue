<template>
    <div class="star-rating">
        <button v-for="star in 5" :key="star" type="button" class="star-rating__star"
            :class="{ 'star-rating__star--active': star <= displayValue, 'star-rating__star--readonly': readonly }"
            @click="!readonly && onSelect(star)" @mouseenter="!readonly && (hovered = star)"
            @mouseleave="!readonly && (hovered = 0)">★</button>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: Number,
        default: 0
    },
    readonly: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])

const hovered = ref(0)

const displayValue = computed(() => hovered.value || props.modelValue)

function onSelect(star) {
    emit('update:modelValue', star)
}
</script>

<style lang="scss" scoped>
.star-rating {
    display: flex;
    gap: 4px;

    &__star {
        font-size: 1.5rem;
        color: $second-color;
        cursor: pointer;
        transition: $transition;
        line-height: 1;

        &--active {
            color: $accent-color;
        }

        &--readonly {
            cursor: default;
        }
    }
}
</style>