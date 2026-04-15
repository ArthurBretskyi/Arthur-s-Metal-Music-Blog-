<template>
    <div class="comment-item">
        <div class="comment-item__header">
            <span class="comment-item__author">{{ comment.username }}</span>
            <span class="comment-item__date">{{ formattedDate }}</span>
        </div>

        <template v-if="isEditing">
            <CommentForm :initialText="comment.text" :isEditing="true" @submit="onEditSubmit" @cancel="isEditing = false" />
        </template>

        <template v-else>
            <p class="comment-item__text">{{ comment.text }}</p>
            <div v-if="canEdit || canDelete" class="comment-item__actions">
                <button v-if="canEdit" type="button" class="comment-item__btn comment-item__btn--edit"
                    @click="isEditing = true">
                    Редагувати
                </button>
                <button v-if="canDelete" type="button" class="comment-item__btn comment-item__btn--delete"
                    @click="onDelete">
                    Видалити
                </button>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import CommentForm from '@/components/Comments/CommentForm.vue'

const props = defineProps({
    comment: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['edit', 'delete'])

const { user, isAdmin } = storeToRefs(useAuthStore())

const isEditing = ref(false)

const isOwner = computed(() => user.value?.uid === props.comment.userId)
const canEdit = computed(() => isOwner.value)
const canDelete = computed(() => isOwner.value || isAdmin.value)

const formattedDate = computed(() => {
    const date = new Date(props.comment.createdAt)
    return date.toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
})

function onEditSubmit(newText) {
    emit('edit', { id: props.comment.id, text: newText })
    isEditing.value = false
}

function onDelete() {
    emit('delete', props.comment.id)
}
</script>

<style lang="scss" scoped>
.comment-item {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    padding: $spacing-md 0;
    border-bottom: 1px solid color.adjust($cards-background-color, $lightness: 8%);

    &:last-child {
        border-bottom: none;
    }

    &__header {
        display: flex;
        align-items: center;
        gap: $spacing-md;
    }

    &__author {
        font-size: $sm;
        font-weight: 600;
        color: $accent-color;
    }

    &__date {
        font-size: $sm;
        color: $second-color;
    }

    &__text {
        font-size: $base-size;
        font-weight: $font-weight;
        color: $main-color;
        line-height: 1.6;
    }

    &__actions {
        display: flex;
        gap: $spacing-sm;
    }

    &__btn {
        font-family: $main-font;
        font-size: $sm;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        transition: $transition;

        &--edit {
            color: $second-color;

            &:hover {
                color: $main-color;
            }
        }

        &--delete {
            color: $second-color;

            &:hover {
                color: $decor-color;
            }
        }
    }
}
</style>