<template>
    <div class="card">
        <div class="card__image">
            <img src="" alt="album cover" class="card__img">
        </div>
        <div class="card__body">
            <h2 class="card__title">{{ release.band }}</h2>
            <h3 class="card__sub-title">{{ release.album }}</h3>
            <div class="card__meta">
                <span class="card__label">{{ release.label }}</span>
                <span class="card__date">{{ release.date }}</span>
            </div>
            <span class="card__genre">{{ release.genre.join(' · ') }}</span>
            <RouterLink :to="{ name: 'Release', params: { id: release.id } }" class="card__link">
                To Release →
            </RouterLink>
        </div>
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

<style lang="scss" scoped>
.card {
    background-color: $cards-background-color;
    border-radius: $border-radius;
    border: 1px solid lighten($cards-background-color, 8%);
    overflow: hidden;
    transition: $transition;
    cursor: pointer;

    &:hover {
        transform: translateY(-4px);
        border-color: $accent-color;
    }

    &__image {
        width: 100%;
        aspect-ratio: 1 / 1;
        background-color: lighten($cards-background-color, 4%);
        overflow: hidden;
    }

    &__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    &__body {
        padding: $spacing-md;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    &__title {
        font-size: $base-size;
        font-weight: 600;
        color: $main-color;
        letter-spacing: 0.02em;
    }

    &__sub-title {
        font-size: $sm;
        font-weight: $font-weight;
        color: $second-color;
    }

    &__meta {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 4px;
    }

    &__label,
    &__date {
        font-size: 0.75rem;
        color: $second-color;
    }

    &__genre {
        display: inline-block;
        align-self: flex-start;
        font-size: 0.7rem;
        color: $accent-color;
        border: 1px solid $second-color;
        border-radius: $border-radius;
        padding: 4px $spacing-sm;
        margin-top: 4px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }

    &__link {
        display: inline-block;
        align-self: flex-start;
        margin-top: $spacing-sm;
        font-size: 0.75rem;
        color: $accent-color;
        text-decoration: none;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        padding: 6px $spacing-md;
        border: 1px solid $second-color;
        border-radius: $border-radius;
        transition: $transition;

        &:hover {
            background-color: $accent-color;
            color: $background-color;
        }
    }
}
</style>

