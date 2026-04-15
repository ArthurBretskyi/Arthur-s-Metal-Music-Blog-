<template>
    <div class="release-comments">
        <div class="release-comments__container">
            <h3 class="release-comments__title">Обговорення</h3>

            <CommentForm @submit="onAddComment" />

            <div v-if="isLoading" class="release-comments__loading">
                Завантаження...
            </div>

            <div v-else-if="!comments.length" class="release-comments__empty">
                Коментарів ще немає. Будь першим!
            </div>

            <div v-else class="release-comments__list">
                <CommentItem v-for="comment in comments" :key="comment.id" :comment="comment" @edit="onEditComment"
                    @delete="onDeleteComment" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useGeneralStore } from '@/stores/general'
import { useCommentsStore } from '@/stores/comments'
import CommentForm from '@/components/Comments/CommentForm.vue'
import CommentItem from '@/components/Comments/CommentItem.vue'

const props = defineProps({
    releaseId: {
        type: String,
        required: true
    }
})

const { user } = storeToRefs(useAuthStore())
const { isLoading } = storeToRefs(useGeneralStore())

const commentsStore = useCommentsStore()
const { getItemsList: comments } = storeToRefs(commentsStore)

onMounted(() => {
    commentsStore.loadByRelease(props.releaseId)
})

async function onAddComment(text) {
    if (!user.value) return
    await commentsStore.addNewComment({
        releaseId: props.releaseId,
        userId: user.value.uid,
        username: user.value.displayName || user.value.email.split('@')[0],
        text,
        createdAt: new Date().toISOString(),
    })
    await commentsStore.loadByRelease(props.releaseId)
}

async function onEditComment({ id, text }) {
    await commentsStore.updateComment(id, {
        text,
        updatedAt: new Date().toISOString(),
    })
    await commentsStore.loadByRelease(props.releaseId)
}

async function onDeleteComment(id) {
    await commentsStore.removeComment(id)
    await commentsStore.loadByRelease(props.releaseId)
}
</script>

<style lang="scss" scoped>
.release-comments {
    margin-top: $spacing-lg;
    border-top: 1px solid color.adjust($cards-background-color, $lightness: 8%);
    padding-top: $spacing-lg;

    &__container {
        display: flex;
        flex-direction: column;
        gap: $spacing-lg;
    }

    &__title {
        font-size: $lg;
        font-weight: 600;
        color: $main-color;
        margin: 0;
    }

    &__loading,
    &__empty {
        font-size: $sm;
        color: $second-color;
        text-align: center;
        padding: $spacing-lg 0;
    }

    &__list {
        display: flex;
        flex-direction: column;
    }
}
</style>