<template>
    <div class="release-form__container">
        <form @submit.prevent="onSubmit" class="release-form__form">

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

                <div class="form__field">
                    <label class="form__label">Cover</label>
                    <div class="cover-upload">
                        <div class="cover-upload__preview">
                            <img v-if="coverPreview" :src="coverPreview" alt="cover preview" class="cover-upload__img" />
                            <span v-else class="cover-upload__placeholder">No image</span>
                        </div>
                        <label for="cover" class="cover-upload__btn">
                            Choose file
                            <input type="file" id="cover" accept="image/*" class="cover-upload__input"
                                @change="onCoverChange" />
                        </label>
                    </div>
                </div>
            </div>

            <div class="form__section">
                <p class="form__section-title">Genres</p>

                <div v-for="genre in genreNames" :key="genre" class="genre-item">
                    <input type="checkbox" :id="genre" v-model="newRelease.genre" :value="genre" class="genre-item__input">
                    <span class="genre-item__box"></span>
                    <label :for="genre" class="genre-item__label">{{ genre }}</label>
                </div>

                <div class="new-genre-row">
                    <input type="text" v-model="newGenre" placeholder="New genre..." class="form__input">
                    <button type="button" @click="addNewGenre" class="btn btn--outline">Add genre</button>
                </div>
            </div>

            <div class="form__section">
                <p class="form__section-title">Rating</p>
                <StarRating v-model="newRelease.rating" />
            </div>

            <div class="form__footer">
                <button type="submit" class="btn btn--submit">Add release</button>
            </div>

        </form>
    </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useReleasesStore } from '@/stores/releases'
import { useGenresStore } from '@/stores/genres'
import { useAuthStore } from '@/stores/auth'
import { uploadImage } from '@/utils/uploadImage.js'
import StarRating from '@/components/StarRating.vue'

const router = useRouter()

const releasesStore = useReleasesStore()
const genresStore = useGenresStore()

const { getItemsList: genres } = storeToRefs(genresStore)
const genreNames = computed(() => genres.value.map(g => g.name))

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const coverFile = ref(null)
const coverPreview = ref(null)

const newRelease = reactive({
    band: '',
    album: '',
    label: '',
    genre: [],
    date: '',
    description: '',
    rating: 0
})

const newGenre = ref('')

async function onSubmit() {
    let coverUrl = ''
    if (coverFile.value) {
        coverUrl = await uploadImage(coverFile.value)
    }

    await releasesStore.addNewRelease({ ...newRelease, cover: coverUrl, userId: user.value.uid })

    newRelease.band = ''
    newRelease.album = ''
    newRelease.label = ''
    newRelease.genre = []
    newRelease.date = ''
    newRelease.description = ''
    newRelease.rating = 0
    coverFile.value = null
    coverPreview.value = null

    router.push({ name: 'Releases' })
}

async function addNewGenre() {
    if (!newGenre.value.trim()) return
    await genresStore.addGenre({ name: newGenre.value.trim() })
    newGenre.value = ''
}


function onCoverChange(event) {
    const file = event.target.files[0]
    if (!file) return
    coverFile.value = file
    coverPreview.value = URL.createObjectURL(file)
}

onMounted(() => {
    if (!genresStore.getItemsList.length) genresStore.loadItemsList()
})
</script>

<style lang="scss" scoped>
.release-form {
    &__container {
        display: flex;
        justify-content: center;
        padding: $spacing-lg $spacing-md;
    }

    &__form {
        width: 100%;
        max-width: 520px;
        background-color: $cards-background-color;
        border: 1px solid color.adjust($cards-background-color, $lightness: 8%);
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
            border-bottom: 1px solid color.adjust($cards-background-color, $lightness: 8%);
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
        border: 1px solid color.adjust($cards-background-color, $lightness: 8%);
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
        border-top: 1px solid color.adjust($cards-background-color, $lightness: 8%);
    }
}

.genre-item {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm 0;
    border-bottom: 1px solid color.adjust($cards-background-color, $lightness: 15%);
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
        border: 1px solid color.adjust($cards-background-color, $lightness: 15%);
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
    border-top: 1px solid color.adjust($cards-background-color, $lightness: 8%);

    .form__input {
        flex: 1;
    }
}

.btn {
    &--outline {
        background: transparent;
        border: 1px solid color.adjust($cards-background-color, $lightness: 15%);
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

    &--seed {
        width: 100%;
        background: transparent;
        border: 1px dashed $second-color;
        border-radius: $border-radius;
        color: $second-color;
        font-family: $main-font;
        font-size: $sm;
        height: 44px;
        cursor: pointer;
        transition: $transition;

        &:hover {
            border-color: $accent-color;
            color: $accent-color;
        }
    }
}

.cover-upload {
    display: flex;
    align-items: flex-start;
    gap: $spacing-md;

    &__preview {
        width: 120px;
        height: 120px;
        flex-shrink: 0;
        background-color: $background-color;
        border: 1px solid color.adjust($cards-background-color, $lightness: 8%);
        border-radius: $border-radius;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    &__placeholder {
        font-size: $sm;
        color: $second-color;
        opacity: 0.5;
    }

    &__input {
        display: none;
    }

    &__btn {
        display: inline-flex;
        align-items: center;
        height: 40px;
        padding: 0 $spacing-md;
        background: transparent;
        border: 1px solid color.adjust($cards-background-color, $lightness: 15%);
        border-radius: $border-radius;
        color: $second-color;
        font-family: $main-font;
        font-size: $sm;
        font-weight: 500;
        cursor: pointer;
        transition: $transition;

        &:hover {
            border-color: $accent-color;
            color: $accent-color;
        }
    }
}

.dev-tools {
    padding-top: $spacing-md;
    border-top: 1px dashed $second-color;
}
</style>