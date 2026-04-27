<template>
    <div class="admin">
        <div class="admin__container">
            <template v-if="!isChildRoute">
                <h1 class="admin__title">Admin Panel</h1>
                <div class="admin__grid">
                    <RouterLink :to="{ name: 'AdminUsers' }" class="admin__card">
                        <span class="admin__card-icon">👥</span>
                        <span class="admin__card-title">Users</span>
                        <span class="admin__card-desc">Manage registered users</span>
                    </RouterLink>
                </div>
            </template>

            <RouterView />
            <!-- DEV ONLY: remove after first seed -->
            <!-- <div v-if="isAdmin" class="dev-tools">
                    <button type="button" @click="onSeed" class="btn btn--seed">
                        🌱 Seed Database
                    </button>
                </div> -->
        </div>
    </div>
</template>

<script setup>
// import { useAuthStore } from '@/stores/auth'
// import { seedDatabase } from '@/utils/seed/seed.js'
// import { storeToRefs } from 'pinia';
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isChildRoute = computed(() => route.name !== 'Admin')

// const authStore = useAuthStore()
// const { isAdmin } = storeToRefs(authStore)

// async function onSeed() {
//     await seedDatabase()
// }

</script>

<style lang="scss" scoped>
.admin {
    padding: $spacing-lg 0;

    &__container {
        max-width: 960px;
    }

    &__title {
        font-size: $xl;
        font-weight: 500;
        color: $main-color;
        margin-bottom: $spacing-lg;
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: $spacing-md;
    }

    &__card {
        display: flex;
        flex-direction: column;
        gap: $spacing-sm;
        padding: $spacing-lg $spacing-md;
        background-color: $cards-background-color;
        border: 1px solid color.adjust($cards-background-color, $lightness: 8%);
        border-radius: $border-radius;
        transition: $transition;
        cursor: pointer;

        &:hover {
            border-color: $accent-color;
            transform: translateY(-2px);
        }
    }

    &__card-icon {
        font-size: $xl;
    }

    &__card-title {
        font-size: $base-size;
        font-weight: 500;
        color: $main-color;
    }

    &__card-desc {
        font-size: $sm;
        color: $second-color;
    }
}

.dev-tools {
    padding-top: $spacing-md;
    border-top: 1px dashed $second-color;
}
</style>