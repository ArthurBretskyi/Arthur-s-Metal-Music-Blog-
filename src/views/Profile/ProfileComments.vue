<template>
    <div class="profile-comments">
        <div v-if="isLoading" class="profile-comments__state">
            Loading...
        </div>

        <div v-else-if="!comments.length" class="profile-comments__state">
            No comments yet.
        </div>

        <div v-else class="profile-comments__list">
            <div v-for="comment in comments" :key="comment.id" class="profile-comments__row">
                <div class="profile-comments__main">
                    <RouterLink :to="{ name: 'Release', params: { id: comment.releaseId } }"
                        class="profile-comments__release-link">
                        → Release
                    </RouterLink>
                    <p class="profile-comments__text">{{ comment.text }}</p>
                </div>
                <span class="profile-comments__date">{{ formatDate(comment.createdAt) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import DbOperations from '@/stores/helpers/DbOperations'
import { useGeneralStore } from '@/stores/general'

const comments = ref([])
const { generalApiOperation } = useGeneralStore()
const commentsDB = new DbOperations('comments')

const props = defineProps({
    userId: {
        type: String,
        required: true,
    }
})


const { isLoading } = storeToRefs(useGeneralStore())

function formatDate(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

onMounted(async () => {
    comments.value = await generalApiOperation({
        operation: () => commentsDB.loadFilteredData('userId', '==', props.userId)
    })
})
</script>

<style lang="scss" scoped>
.profile-comments {

    &__state {
        font-size: $sm;
        color: $second-color;
        text-align: center;
        padding: $spacing-lg 0;
    }

    &__list {
        display: flex;
        flex-direction: column;
        gap: $spacing-sm;
    }

    &__row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: $spacing-md;
        padding: $spacing-sm $spacing-md;
        background-color: $cards-background-color;
        border: 1px solid color.adjust($cards-background-color, $lightness: 8%);
        border-radius: $border-radius;
        transition: $transition;

        &:hover {
            border-color: color.adjust($cards-background-color, $lightness: 15%);
        }
    }

    &__main {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
    }

    &__release-link {
        font-size: 0.75rem;
        color: $accent-color;
        transition: $transition;
        align-self: flex-start;

        &:hover {
            opacity: 0.7;
        }
    }

    &__text {
        font-size: $sm;
        color: $main-color;
        font-weight: $font-weight;
        line-height: 1.5;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 600px;
    }

    &__date {
        font-size: 0.75rem;
        color: $second-color;
        white-space: nowrap;
        flex-shrink: 0;

        @media (max-width: $bp-mobile) {
            display: none;
        }
    }
}
</style>
