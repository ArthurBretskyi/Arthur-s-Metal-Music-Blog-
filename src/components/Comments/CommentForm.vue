<template>
    <div class="comment-form">
        <div v-if="!user" class="comment-form__auth-notice">
            <span>Увійдіть, щоб залишити коментар</span>
        </div>

        <form v-else @submit.prevent="onSubmit" class="comment-form__form">
            <textarea v-model="text" class="comment-form__textarea" placeholder="Напишіть коментар..." rows="3"
                required></textarea>
            <div class="comment-form__footer">
                <button v-if="isEditing" type="button" class="comment-form__btn comment-form__btn--cancel"
                    @click="onCancel">
                    Скасувати
                </button>
                <button type="submit" class="comment-form__btn comment-form__btn--submit"
                    :disabled="isLoading || !text.trim()">
                    {{ isLoading ? 'Збереження...' : isEditing ? 'Зберегти' : 'Надіслати' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useGeneralStore } from '@/stores/general'

const props = defineProps({
    initialText: {
        type: String,
        default: ''
    },
    isEditing: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['submit', 'cancel'])

const { user } = storeToRefs(useAuthStore())
const { isLoading } = storeToRefs(useGeneralStore())

const text = ref(props.initialText)

watch(() => props.initialText, (val) => {
    text.value = val
})

function onSubmit() {
    if (!text.value.trim()) return
    emit('submit', text.value.trim())
    if (!props.isEditing) text.value = ''
}

function onCancel() {
    text.value = props.initialText
    emit('cancel')
}
</script>

<style lang="scss" scoped>
.comment-form {
    &__auth-notice {
        padding: $spacing-md;
        border: 1px solid color.adjust($cards-background-color, $lightness: 8%);
        border-radius: $border-radius;
        color: $second-color;
        font-size: $sm;
        text-align: center;
    }

    &__form {
        display: flex;
        flex-direction: column;
        gap: $spacing-sm;
    }

    &__textarea {
        width: 100%;
        background-color: $background-color;
        border: 1px solid color.adjust($cards-background-color, $lightness: 8%);
        border-radius: $border-radius;
        color: $main-color;
        font-family: $main-font;
        font-size: $base-size;
        font-weight: $font-weight;
        padding: $spacing-sm $spacing-md;
        resize: vertical;
        outline: none;
        transition: $transition;

        &::placeholder {
            color: $second-color;
            opacity: 0.5;
        }

        &:focus {
            border-color: $accent-color;
        }
    }

    &__footer {
        display: flex;
        justify-content: flex-end;
        gap: $spacing-sm;
    }

    &__btn {
        height: 36px;
        padding: 0 $spacing-md;
        border-radius: $border-radius;
        font-family: $main-font;
        font-size: $sm;
        font-weight: 500;
        cursor: pointer;
        transition: $transition;

        &--submit {
            background: transparent;
            border: 1px solid $accent-color;
            color: $accent-color;

            &:hover:not(:disabled) {
                background-color: $accent-color;
                color: $background-color;
            }

            &:disabled {
                opacity: 0.4;
                cursor: default;
            }
        }

        &--cancel {
            background: transparent;
            border: 1px solid $second-color;
            color: $second-color;

            &:hover {
                border-color: $main-color;
                color: $main-color;
            }
        }
    }
}
</style>