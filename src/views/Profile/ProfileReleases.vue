<template>
    <div class="profile-releases">
        <div v-if="isLoading" class="profile-releases__state">
            Loading...
        </div>

        <div v-else-if="!releases.length" class="profile-releases__state">
            No releases yet.
        </div>

        <div v-else class="profile-releases__list">
            <div v-for="release in releases" :key="release.id" class="profile-releases__row">
                <div class="profile-releases__cover">
                    <img v-if="release.cover" :src="release.cover" :alt="release.album"
                        class="profile-releases__cover-img" />
                </div>
                <div class="profile-releases__meta">
                    <span class="profile-releases__band">{{ release.band }}</span>
                    <span class="profile-releases__album">{{ release.album }}</span>
                </div>
                <span class="profile-releases__date">{{ release.date }}</span>
                <div class="profile-releases__actions">
                    <RouterLink :to="{ name: 'Edit', params: { id: release.id } }" class="profile-releases__btn">
                        Edit
                    </RouterLink>
                    <button type="button" class="profile-releases__btn profile-releases__btn--danger"
                        @click="onDelete(release.id)">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import DbOperations from '@/stores/helpers/DbOperations'
import { useGeneralStore } from '@/stores/general'

const releases = ref([])
const { generalApiOperation } = useGeneralStore()
const releasesDB = new DbOperations('releases')

const props = defineProps({
    userId: {
        type: String,
        required: true,
    }
})


const { isLoading } = storeToRefs(useGeneralStore())

async function onDelete(id) {
    const confirmed = confirm('Delete this release?')
    if (!confirmed) return
    await releasesStore.deleteItem(id)
}

onMounted(async () => {
    releases.value = await generalApiOperation({
        operation: () => releasesDB.loadFilteredData('userId', '==', props.userId)
    })
})
</script>

<style lang="scss" scoped>
.profile-releases {

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
        align-items: center;
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

    &__cover {
        width: 44px;
        height: 44px;
        flex-shrink: 0;
        border-radius: $border-radius;
        overflow: hidden;
        background-color: color.adjust($cards-background-color, $lightness: 8%);
    }

    &__cover-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &__meta {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 3px;
        min-width: 0;
    }

    &__band {
        font-size: $sm;
        font-weight: 500;
        color: $main-color;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__album {
        font-size: 0.75rem;
        color: $second-color;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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

    &__actions {
        display: flex;
        gap: $spacing-sm;
        flex-shrink: 0;
    }

    &__btn {
        font-family: $main-font;
        font-size: 0.75rem;
        font-weight: 500;
        padding: 4px $spacing-sm;
        border-radius: $border-radius;
        border: 1px solid color.adjust($cards-background-color, $lightness: 15%);
        background: transparent;
        color: $second-color;
        cursor: pointer;
        transition: $transition;
        white-space: nowrap;

        &:hover {
            border-color: $accent-color;
            color: $accent-color;
        }

        &--danger {
            &:hover {
                border-color: $decor-color;
                color: $decor-color;
            }
        }
    }
}
</style>