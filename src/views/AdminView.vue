<template>
    <div class="admin">
        <div class="admin__container">
            <p>will expand in the future</p>
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

// const authStore = useAuthStore()
// const { isAdmin } = storeToRefs(authStore)

// async function onSeed() {
//     await seedDatabase()
// }

</script>

<style lang="scss" scoped>
.admin {
    &__container {
        display: flex;
        justify-content: center;
        padding: $spacing-lg $spacing-md;
    }
}

.dev-tools {
    padding-top: $spacing-md;
    border-top: 1px dashed $second-color;
}
</style>