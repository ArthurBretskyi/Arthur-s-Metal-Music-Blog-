<template>
    <div class="card__container">
        <div class="card__image">
            <img src="" alt="album cover" class="card__img">
        </div>
        <h2 class="card__title">{{ release.band }}</h2>
        <h3 class="card__sub-title">{{ release.album }}</h3>
        <span class="card__label">{{ release.label }}</span>
        <span class="card__date">{{ release.date }}</span>
        <span class="card__genre">{{ release.genre.join(', ') }}</span>
        <RouterLink :to="{ name: 'Release', params: { id: release.id } }">To release</RouterLink>
    </div>
</template>

<script setup>
defineProps({
    release: {
        type: Object,
        required: true
    }
})
</script>

<style lang="scss" scoped></style>