<template>
    <div class="auth-modal">
        <div class="auth-modal__container">
            <button class="auth-modal__close-btn" @click="toggleAuthModal">✕</button>
            <button class="auth-modal__toggle-btn" @click="toggleMode">{{ modeTitle }}</button>
            <div class="auth-modal__question">{{ mode === 'login' ? 'No account?' : 'Already have an account?'
            }}
                <button class="auth-modal__question-btn" @click="toggleMode">{{ mode === 'login' ? 'Register' : 'Login'
                }}</button>
            </div>
            <form @submit.prevent="handleAuth" class="auth-modal__form">
                <div v-if="mode === 'login'" class="auth-modal__login">
                    <input v-model="form.email" type="email" placeholder="Email" class="auth-modal__input" required />
                    <input v-model="form.password" type="password" placeholder="Password" class="auth-modal__input"
                        required />
                </div>
                <div v-else class="auth-modal__register">
                    <input v-model="form.email" type="email" placeholder="Email" class="auth-modal__input" required />
                    <input v-model="form.password" type="password" placeholder="Password" class="auth-modal__input"
                        required />
                    <input v-model="form.confirmPassword" type="password" placeholder="Confirm password"
                        class="auth-modal__input" required />
                </div>

                <button type="submit" :disabled="isLoading" class="auth-modal__btn">
                    {{ isLoading ? 'Loading...' : modeTitle }}
                </button>
                <div class="auth-modal__or">
                    <span>or</span>
                </div>
                <button type="button" @click="handleGoogle" class="auth-modal__google-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google</button>
            </form>
            <p v-if="hasError" class="auth-modal__error">{{ errorMessage }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui'
import { useGeneralStore } from '@/stores/general'

const authStore = useAuthStore()
const { loginWithEmail, registerWithEmail, loginWithGoogleAccount } = authStore
const uiStore = useUiStore()
const { toggleAuthModal } = uiStore

const generalStore = useGeneralStore()
const { generalApiOperation } = generalStore
const { isLoading, hasError, errorMessage } = storeToRefs(generalStore)

const mode = ref('login')
const modeTitle = computed(() => mode.value === 'login' ? 'Login' : 'Register')

const form = reactive({
    email: '',
    password: '',
    confirmPassword: ''
})

function toggleMode() {
    mode.value = mode.value === 'login' ? 'register' : 'login'
}

async function handleAuth() {
    await generalApiOperation(async () => {
        if (mode.value === 'login') await loginWithEmail(form.email, form.password)
        else await registerWithEmail(form.email, form.password)
        toggleAuthModal()
    })
}

async function handleGoogle() {
    await generalApiOperation(async () => {
        await loginWithGoogleAccount()
        toggleAuthModal()
    })
}
</script>

<style lang="scss" scoped>
.auth-modal {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-md;

    &__container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: $spacing-lg $spacing-md;
        background-color: $background-color;
        border: 1px solid lighten($cards-background-color, 8%);
        border-radius: $border-radius * 2;
        padding: $spacing-lg;

    }

    &__close-btn {
        align-self: flex-end;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
        color: $accent-color;
    }

    &__toggle-btn {
        font-size: $xl;
        text-align: left;
        margin-block-end: $spacing-sm;
        cursor: pointer;
    }

    &__question {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        margin-block-end: $spacing-md;
    }

    &__question-btn {
        font-size: $lg;
        color: $accent-color;
        cursor: pointer;
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

    &__login {}

    &__input {
        width: 100%;
        background-color: $background-color;
        border: 1px solid lighten($cards-background-color, 8%);
        border-radius: $border-radius;
        color: $main-color;
        font-family: $main-font;
        font-size: $base-size;
        font-weight: $font-weight;
        padding: 0 $spacing-md;
        margin-block-end: $spacing-md;
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

    &__register {}

    &__btn {
        @include form-btn($cards-background-color,
            $border-radius,
            $second-color,
            $main-font,
            $sm,
            $spacing-md,
            $transition,
            $accent-color)
    }

    &__or {
        display: flex;
        align-items: center;
        text-align: center;

        &::before,
        &::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid rgb(40.4, 40.4, 40.4);
            margin: 0 10px;
        }

        span {
            color: $accent-color;
        }
    }

    &__google-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: $sm;
        @include form-btn($cards-background-color,
            $border-radius,
            $second-color,
            $main-font,
            $sm,
            $spacing-md,
            $transition,
            $accent-color)
    }

    &__error {
        margin-block-start: $lg;
        margin-block-end: $lg;
        text-align: center;
        color: $decor-color;
    }
}
</style>