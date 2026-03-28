<template>
    <div class="admin__container">
        <form @submit.prevent="onSubmit" class="admin__form">

            <div class="form__section">
                <p class="form__section-title">Release info</p>

                <div class="form__field">
                    <label for="band" class="form__label">Band</label>
                    <input type="text" id="band" v-model="newRelease.band" class="form__input">
                </div>

                <div class="form__field">
                    <label for="album" class="form__label">Album</label>
                    <input type="text" id="album" v-model="newRelease.album" class="form__input">
                </div>

                <div class="form__field">
                    <label for="label" class="form__label">Label</label>
                    <input type="text" id="label" v-model="newRelease.label" class="form__input">
                </div>

                <div class="form__field">
                    <label for="date" class="form__label">Date</label>
                    <input type="text" id="date" v-model="newRelease.date" class="form__input">
                </div>

                <div class="form__field">
                    <label for="description" class="form__label">Description</label>
                    <textarea id="description" rows="4" v-model="newRelease.description" class="form__textarea"></textarea>
                </div>
            </div>

            <div class="form__section">
                <p class="form__section-title">Genres</p>

                <div v-for="genre in availableGenres" :key="genre" class="genre-item">
                    <input type="checkbox" :id="genre" v-model="newRelease.genre" :value="genre" class="genre-item__input">
                    <span class="genre-item__box"></span>
                    <label :for="genre" class="genre-item__label">{{ genre }}</label>
                </div>

                <div class="new-genre-row">
                    <input type="text" v-model="newGenre" placeholder="New genre..." class="form__input">
                    <button type="button" @click="addNewGenre" class="btn btn--outline">Add genre</button>
                </div>
            </div>

            <div class="form__footer">
                <button type="submit" class="btn btn--submit">Add release</button>
            </div>

        </form>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useReleasesStore } from '@/stores/releases';
import { storeToRefs } from 'pinia';

const router = useRouter()
const store = useReleasesStore()
const { availableGenres } = storeToRefs(store)
const { addNewRelease, addGenre } = store

const newRelease = reactive({
    band: '',
    album: '',
    label: '',
    genre: [],
    date: '',
    description: ''
})

const newGenre = ref('')

function onSubmit() {
    addNewRelease(newRelease)
    newRelease.band = '',
        newRelease.album = ''
    newRelease.label = ''
    newRelease.genre = []
    newRelease.date = ''
    newRelease.description = ''

    router.push({ name: 'Releases' })

}

function addNewGenre() {
    addGenre(newGenre.value)
    newGenre.value = ''
}

</script>

<style lang="scss" scoped>
.admin {
    &__container {
        display: flex;
        justify-content: center;
        padding: $spacing-lg $spacing-md;
    }

    &__form {
        width: 100%;
        max-width: 520px;
        background-color: $cards-background-color;
        border: 1px solid lighten($cards-background-color, 8%);
        border-radius: $border-radius * 2;
        padding: $spacing-lg;
        display: flex;
        flex-direction: column;
        gap: $spacing-md;
    }
}

.form {
    &__section {
        display: flex;
        flex-direction: column;
        gap: $spacing-sm;

        &-title {
            font-size: $sm;
            font-weight: 500;
            color: $second-color;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            padding-bottom: $spacing-sm;
            border-bottom: 1px solid lighten($cards-background-color, 8%);
        }
    }

    &__label {
        font-size: $sm;
        font-weight: 500;
        color: $second-color;
        letter-spacing: 0.03em;
    }

    &__input,
    &__textarea {
        width: 100%;
        background-color: $background-color;
        border: 1px solid lighten($cards-background-color, 8%);
        border-radius: $border-radius;
        color: $main-color;
        font-family: $main-font;
        font-size: $base-size;
        font-weight: $font-weight;
        padding: 0 $spacing-md;
        height: 40px;
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

    &__textarea {
        height: auto;
        padding: $spacing-sm $spacing-md;
        resize: vertical;
    }

    &__field {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    &__footer {
        padding-top: $spacing-md;
        border-top: 1px solid lighten($cards-background-color, 8%);
    }
}

.genre-item {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm 0;
    border-bottom: 1px solid lighten($cards-background-color, 5%);
    cursor: pointer;

    &:last-of-type {
        border-bottom: none;
    }

    &__input {
        display: none;
    }

    &__box {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        border: 1px solid lighten($cards-background-color, 15%);
        border-radius: 4px;
        background-color: $background-color;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: $transition;

        &::after {
            content: '';
            display: none;
            width: 5px;
            height: 9px;
            border-right: 2px solid $background-color;
            border-bottom: 2px solid $background-color;
            transform: rotate(45deg) translate(-1px, -1px);
        }
    }

    &__input:checked+&__box {
        background-color: $accent-color;
        border-color: $accent-color;

        &::after {
            display: block;
        }
    }

    &__label {
        font-size: $base-size;
        font-weight: $font-weight;
        color: $second-color;
        cursor: pointer;
        transition: $transition;
    }

    &__input:checked~&__label {
        color: $main-color;
    }
}

.new-genre-row {
    display: flex;
    gap: $spacing-sm;
    padding-top: $spacing-md;
    border-top: 1px solid lighten($cards-background-color, 8%);

    .form__input {
        flex: 1;
    }
}

.btn {
    &--outline {
        background: transparent;
        border: 1px solid lighten($cards-background-color, 15%);
        border-radius: $border-radius;
        color: $second-color;
        font-family: $main-font;
        font-size: $sm;
        font-weight: 500;
        padding: 0 $spacing-md;
        height: 40px;
        white-space: nowrap;
        cursor: pointer;
        transition: $transition;

        &:hover {
            border-color: $accent-color;
            color: $accent-color;
        }
    }

    &--submit {
        width: 100%;
        background: transparent;
        border: 1px solid $accent-color;
        border-radius: $border-radius;
        color: $accent-color;
        font-family: $main-font;
        font-size: $base-size;
        font-weight: 500;
        height: 44px;
        letter-spacing: 0.05em;
        cursor: pointer;
        transition: $transition;

        &:hover {
            background-color: $accent-color;
            color: $background-color;
        }
    }
}
</style>