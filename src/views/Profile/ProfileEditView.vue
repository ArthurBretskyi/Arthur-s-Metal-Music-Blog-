<template>
    <div class="profile-edit">
        <div class="profile-edit__container">

            <div class="profile-edit__header">
                <RouterLink :to="{ name: 'Profile' }" class="profile-edit__back">← Back</RouterLink>
                <h2 class="profile-edit__title">Edit profile</h2>
            </div>

            <form @submit.prevent="onSubmit" class="profile-edit__form">

                <div class="profile-edit__avatar-section">
                    <div class="profile-edit__avatar">
                        <img v-if="avatarPreview" :src="avatarPreview" alt="avatar" class="profile-edit__avatar-img" />
                        <span v-else class="profile-edit__avatar-initials">{{ initials }}</span>
                    </div>
                    <label for="avatar" class="profile-edit__upload-btn">
                        Change photo
                        <input type="file" id="avatar" accept="image/*" class="profile-edit__file-input"
                            @change="onAvatarChange" />
                    </label>
                </div>

                <div class="profile-edit__field">
                    <label for="firstName" class="profile-edit__label">First name</label>
                    <input type="text" id="firstName" v-model="form.firstName" class="profile-edit__input"
                        placeholder="Your name" />
                </div>

                <div class="profile-edit__field">
                    <label for="username" class="profile-edit__label">Username</label>
                    <input type="text" id="username" v-model="form.username" class="profile-edit__input"
                        placeholder="Your username" />
                </div>

                <p v-if="hasError" class="profile-edit__error">{{ errorMessage }}</p>

                <button type="submit" :disabled="isLoading" class="profile-edit__btn">
                    {{ isLoading ? 'Saving...' : 'Save changes' }}
                </button>

            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useGeneralStore } from '@/stores/general'
import { uploadImage } from '@/utils/uploadImage'

const router = useRouter()

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { updateUserProfile } = authStore

const generalStore = useGeneralStore()
const { isLoading, hasError, errorMessage } = storeToRefs(generalStore)
const { generalApiOperation } = generalStore

const avatarFile = ref(null)
const avatarPreview = ref(null)

const form = reactive({
    firstName: '',
    username: '',
})

const initials = computed(() =>
    (form.firstName || user.value?.email || 'U').charAt(0).toUpperCase()
)

onMounted(() => {
    form.firstName = user.value?.firstName || ''
    form.username = user.value?.username || ''
    avatarPreview.value = user.value?.photoURL || null
})

function onAvatarChange(event) {
    const file = event.target.files[0]
    if (!file) return
    avatarFile.value = file
    avatarPreview.value = URL.createObjectURL(file)
}

async function onSubmit() {
    await generalApiOperation(async () => {
        const updatedData = {
            firstName: form.firstName,
            username: form.username,
        }

        if (avatarFile.value) {
            updatedData.photoURL = await uploadImage(avatarFile.value)
        }

        await updateUserProfile(user.value.uid, updatedData)
        router.push({ name: 'Profile' })
    })
}
</script>

<style lang="scss" scoped>
.profile-edit {
    padding: $spacing-lg 0;

    &__container {
        max-width: 520px;
        display: flex;
        flex-direction: column;
        gap: $spacing-lg;
    }

    &__header {
        display: flex;
        align-items: center;
        gap: $spacing-md;
    }

    &__back {
        font-size: $sm;
        color: $second-color;
        transition: $transition;

        &:hover {
            color: $accent-color;
        }
    }

    &__title {
        font-size: $xl;
        font-weight: 500;
        color: $main-color;
    }

    &__form {
        background-color: $cards-background-color;
        border: 1px solid color.adjust($cards-background-color, $lightness: 8%);
        border-radius: $border-radius * 2;
        padding: $spacing-lg;
        display: flex;
        flex-direction: column;
        gap: $spacing-md;
    }

    &__avatar-section {
        display: flex;
        align-items: center;
        gap: $spacing-md;
        padding-bottom: $spacing-md;
        border-bottom: 1px solid color.adjust($cards-background-color, $lightness: 8%);
    }

    &__avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;
        flex-shrink: 0;
        background-color: $accent-color;
        @include flex-center;
    }

    &__avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &__avatar-initials {
        font-size: $xl;
        font-weight: 500;
        color: $background-color;
    }

    &__upload-btn {
        @include form-btn($cards-background-color,
            $border-radius,
            $second-color,
            $main-font,
            $sm,
            $spacing-md,
            $transition,
            $accent-color );
        display: inline-flex;
        align-items: center;
        cursor: pointer;
    }

    &__file-input {
        display: none;
    }

    &__field {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    &__label {
        font-size: $sm;
        font-weight: 500;
        color: $second-color;
        letter-spacing: 0.03em;
    }

    &__input {
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

    &__error {
        font-size: $sm;
        color: $decor-color;
        text-align: center;
    }

    &__btn {
        @include form-btn($cards-background-color,
            $border-radius,
            $second-color,
            $main-font,
            $sm,
            $spacing-md,
            $transition,
            $accent-color );
        width: 100%;
        height: 44px;
        border-color: $accent-color;
        color: $accent-color;

        &:hover {
            background-color: $accent-color;
            color: $background-color;
        }

        &:disabled {
            opacity: 0.5;
            cursor: default;
        }
    }
}
</style>