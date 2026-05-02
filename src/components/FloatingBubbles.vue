<template>
    <div class="floating-bubbles">
        <div v-for="(flag, index) in flags" :key="index" class="bubble bubble--flag" :class="`bubble--${flag.lang}`"
            @click="switchLanguage(flag.lang)" ref="flagRefs">
            <img :src="flag.src" :alt="flag.lang" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useLocales } from '@/i18n/useLocales'

import ukFlag from '@/assets/flags/uk.svg'
import gbFlag from '@/assets/flags/gb.svg'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, CustomEase)

const { setLocale } = useLocales()

const flags = [
    { lang: 'uk', src: ukFlag },
    { lang: 'en', src: gbFlag }
]

function switchLanguage(lang) {
    setLocale(lang)
}

// 🌊 GSAP refs
const flagRefs = ref([])


onMounted(() => {
    // Початкова анімація появи
    const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 1 } })
    tl.from('.bubble', { opacity: 0, scale: 0.5, stagger: 0.2 })

    // Органічне плавання
    flagRefs.value.forEach((el, i) => {
        gsap.to(el, {
            y: `random(-15, 15)`,
            x: `random(-10, 10)`,
            duration: 3 + Math.random() * 2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.3,
        })
    })



    // ScrollTrigger рух при скролі
    gsap.to('.floating-bubbles', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
        },
    })

    // 🧲 Ефект магнітного поля
    const allBubbles = [...flagRefs.value]
    const radius = 150 // пікселі чутливості
    const strength = 20 // наскільки сильно відхиляється

    const handleMouseMove = (e) => {
        allBubbles.forEach((bubble) => {
            const rect = bubble.getBoundingClientRect()
            const bubbleX = rect.left + rect.width / 2
            const bubbleY = rect.top + rect.height / 2
            const dx = e.clientX - bubbleX
            const dy = e.clientY - bubbleY
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < radius) {
                const angle = Math.atan2(dy, dx)
                const offsetX = -Math.cos(angle) * (strength * (1 - distance / radius))
                const offsetY = -Math.sin(angle) * (strength * (1 - distance / radius))

                gsap.to(bubble, {
                    x: offsetX,
                    y: offsetY,
                    duration: 0.4,
                    ease: 'sine.out',
                })
            } else {
                gsap.to(bubble, { x: 0, y: 0, duration: 1.5, ease: 'sine.inOut' })
            }
        })
    }

    window.addEventListener('mousemove', handleMouseMove)

    onBeforeUnmount(() => {
        clearInterval(messengerInterval)
        window.removeEventListener('mousemove', handleMouseMove)
    })
})
</script>

<style lang="scss" scoped>
.floating-bubbles {
    position: fixed;
    top: 3.5rem;
    left: 15.5rem;
    width: 100%;
    display: flex;
    // justify-content: space-around;
    // flex-direction: column;
    align-items: center;
    gap: 1rem;
    z-index: 50;
    pointer-events: auto;

    .bubble {
        width: 82px;
        height: 82px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(6px);
        border: 1px solid rgba(255, 255, 255, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.4s ease, box-shadow 0.4s ease;
        will-change: transform;

        &:hover {
            transform: scale(1.12);
            box-shadow: 0 0 12px rgba(61, 244, 70, 0.5);
        }

        &--flag img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
        }

        svg {
            width: 30px;
            height: 30px;

        }
    }

}
</style>