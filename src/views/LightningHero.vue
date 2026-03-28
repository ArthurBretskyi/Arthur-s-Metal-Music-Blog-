<template>
    <div class="hero">
        <canvas ref="canvasRef" class="hero__canvas"></canvas>
        <div class="hero__flash" ref="flashRef"></div>

        <!-- Мобайл -->
        <template v-if="isMobile()">
            <div class="hero__mobile-banner">
                <!-- Поточне фото -->
                <img v-if="mobileBannerCurrent" :src="mobileBannerCurrent.src" :alt="mobileBannerCurrent.alt"
                    class="hero__mobile-img" />
                <!-- Наступне фото — з'являється поверх -->
                <Transition name="crossfade">
                    <img v-if="showNext && mobileBannerNext" :key="mobileBannerNext.src" :src="mobileBannerNext.src"
                        :alt="mobileBannerNext.alt" class="hero__mobile-img hero__mobile-img--next" />
                </Transition>
            </div>
            <!-- Слоган статичний -->
            <div class="hero__mobile-slogan">
                <span class="hero__mobile-word">Metal</span>
                <span class="hero__mobile-word">Up Your</span>
                <span class="hero__mobile-word">Ass</span>
            </div>
        </template>

        <!-- Десктоп -->
        <template v-else>
            <Transition name="banner">
                <div v-if="showBanner && bannerItem" class="hero__banner">
                    <img :src="bannerItem.src" :alt="bannerItem.alt" class="hero__banner-img" />
                    <Transition name="slogan">
                        <div v-if="showSlogan" class="hero__slogan">Metal Up Your Ass</div>
                    </Transition>
                </div>
            </Transition>

            <div class="hero__cols">
                <div class="hero__col" v-for="(item, index) in currentItems" :key="index">
                    <Transition name="photo">
                        <img v-if="item.showPhoto" :src="item.src" :alt="item.alt" class="hero__photo" />
                    </Transition>
                </div>
            </div>
        </template>

    </div>
</template>
  
<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'

import dave from '@/assets/pictures/home/Dave Mustaine.png'
import james from '@/assets/pictures/home/James Hetfield.png'
import tom from '@/assets/pictures/home/Tom Araya.png'
import bruce from '@/assets/pictures/home/Bruce Dickinson.png'
import varg from '@/assets/pictures/home/Varg Vikernes.png'
import dime from '@/assets/pictures/home/Dime.png'
import rob from '@/assets/pictures/home/Rob Halford.png'
import master from '@/assets/pictures/home/master-of-puppets.WEBP'
import rust from '@/assets/pictures/home/Rust In Peace.jpg'
import beast from '@/assets/pictures/home/number-of-the-beast.WEBP'
import reign from '@/assets/pictures/home/reign-in-blood.WEBP'
import filosofem from '@/assets/pictures/home/filosofem.jpg'
import vulgar from '@/assets/pictures/home/Vulgar Display of Power.jpg'
import ozzmosis from '@/assets/pictures/home/Ozzmosis.jpg'
import painkiller from '@/assets/pictures/home/Painkiller.jpg'

const items = reactive([
    { src: dave, alt: 'Dave Mustaine', showPhoto: false },
    { src: james, alt: 'James Hetfield', showPhoto: false },
    { src: tom, alt: 'Tom Araya', showPhoto: false },
    { src: bruce, alt: 'Bruce Dickinsona', showPhoto: false },
    { src: varg, alt: 'Varg Vikernes', showPhoto: false },
    { src: dime, alt: 'Dime', showPhoto: false },
    { src: rob, alt: 'Rob Halford', showPhoto: false },
    { src: master, alt: 'master of puppets', showPhoto: false },
    { src: rust, alt: 'Rust In Peace', showPhoto: false },
    { src: beast, alt: 'number of the beast', showPhoto: false },
    { src: reign, alt: 'reign in blood', showPhoto: false },
    { src: filosofem, alt: 'filosofem', showPhoto: false },
    { src: vulgar, alt: 'vulgar display of power', showPhoto: false },
    { src: ozzmosis, alt: 'ozzmosis', showPhoto: false },
    { src: painkiller, alt: 'painkiller', showPhoto: false },
])

const canvasRef = ref(null)
const flashRef = ref(null)
const timers = []

const bannerItem = ref(null)
const showBanner = ref(false)
const showSlogan = ref(false)

const currentItems = ref([])

const isMobile = () => window.matchMedia('(max-width: 767px)').matches

const mobileBannerCurrent = ref(null)
const mobileBannerNext = ref(null)
const showNext = ref(false)

function t(fn, delay) {
    timers.push(setTimeout(fn, delay))
}

// ---- Canvas утиліти ----

function randBetween(a, b) {
    return a + Math.random() * (b - a)
}

function generateBolt(x1, y1, x2, y2, roughness, depth) {
    if (depth === 0) return [[x1, y1], [x2, y2]]
    const mx = (x1 + x2) / 2 + randBetween(-roughness, roughness)
    const my = (y1 + y2) / 2 + randBetween(-roughness * 0.3, roughness * 0.3)
    return [
        ...generateBolt(x1, y1, mx, my, roughness * 0.55, depth - 1),
        ...generateBolt(mx, my, x2, y2, roughness * 0.55, depth - 1).slice(1),
    ]
}

function drawBolt(ctx, points, alpha, width, color) {
    ctx.beginPath()
    ctx.moveTo(points[0][0], points[0][1])
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1])
    ctx.strokeStyle = color
    ctx.globalAlpha = alpha
    ctx.lineWidth = width
    ctx.shadowColor = color
    ctx.shadowBlur = width * 8
    ctx.stroke()
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
}

function drawBranch(ctx, x, y, angle, length, depth) {
    if (depth === 0 || length < 8) return
    const ex = x + Math.cos(angle) * length
    const ey = y + Math.sin(angle) * length
    const pts = generateBolt(x, y, ex, ey, length * 0.25, 3)
    drawBolt(ctx, pts, 0.35 * (depth / 3), 0.6, '#aac8ff')
    if (Math.random() > 0.4) {
        drawBranch(ctx, ex, ey, angle + randBetween(-0.6, -0.2), length * 0.6, depth - 1)
    }
}

// ---- Основна функція удару ----

function strike(xFrac) {
    return new Promise((resolve) => {
        const canvas = canvasRef.value
        const ctx = canvas.getContext('2d')
        const flash = flashRef.value

        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width
        canvas.height = rect.height

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const x = canvas.width * xFrac
        const mainPts = generateBolt(x, 0, x + randBetween(-30, 30), canvas.height, 60, 9)

        // Малюємо болт
        drawBolt(ctx, mainPts, 0.15, 18, '#6699ff')
        drawBolt(ctx, mainPts, 0.25, 8, '#88bbff')
        drawBolt(ctx, mainPts, 0.9, 2, '#ddeeff')
        drawBolt(ctx, mainPts, 0.7, 1, '#ffffff')

        // Гілки
        for (let i = 1; i < mainPts.length - 1; i += 3) {
            if (Math.random() > 0.65) {
                const dir = Math.random() > 0.5 ? 1 : -1
                const angle = Math.PI / 2 + dir * randBetween(0.3, 0.9)
                drawBranch(ctx, mainPts[i][0], mainPts[i][1], angle, randBetween(20, 60), 3)
            }
        }

        // Блимання екрану
        flash.style.opacity = '0.55'
        t(() => { flash.style.opacity = '0.15' }, 50)
        t(() => { flash.style.opacity = '0.40' }, 100)
        t(() => { flash.style.opacity = '0' }, 180)

        // Затухання болту
        let alpha = 1
        const fadeInterval = setInterval(() => {
            alpha -= 0.06
            if (alpha <= 0) {
                clearInterval(fadeInterval)
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                resolve() // повідомляємо що удар завершено
                return
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            drawBolt(ctx, mainPts, alpha * 0.15, 18, '#6699ff')
            drawBolt(ctx, mainPts, alpha * 0.25, 8, '#88bbff')
            drawBolt(ctx, mainPts, alpha * 0.9, 2, '#ddeeff')
            drawBolt(ctx, mainPts, alpha * 0.7, 1, '#ffffff')
        }, 30)
    })
}

function getRandomItems(arr, count) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
}

// ---- Цикл ----

async function runCycle() {
    const HOLD = 2500
    const FADE = 400

    currentItems.value = getRandomItems(items, 3)

    // Фаза 1 — три блискавки + фото
    for (let i = 0; i < currentItems.value.length; i++) {
        await strike(0.2 + i * 0.3)
        currentItems.value[i].showPhoto = true
        await pause(500)
    }

    await pause(HOLD)

    // Фаза 2 — одне фото розтягується в банер
    const randomIndex = Math.floor(Math.random() * currentItems.value.length)
    bannerItem.value = currentItems.value[randomIndex]

    // Ховаємо всі три фото одразу
    currentItems.value.forEach(item => { item.showPhoto = false })

    // Показуємо банер
    showBanner.value = true
    await pause(800) // чекаємо поки розтягнеться

    // Фаза 3 — напис
    showSlogan.value = true
    await pause(2000)
    showSlogan.value = false
    await pause(400)

    // Фаза 4 — банер зникає
    showBanner.value = false
    await pause(600)

    // Коротка пауза і новий цикл
    await pause(300)
    runCycle()
}

async function runBannerCycle() {
    mobileBannerCurrent.value = items[Math.floor(Math.random() * items.length)]

    while (true) {
        await pause(4000)
        // Готуємо наступне фото (інше ніж поточне)
        let next
        do {
            next = items[Math.floor(Math.random() * items.length)]
        } while (next === mobileBannerCurrent.value)

        mobileBannerNext.value = next
        showNext.value = true         // next з'являється поверх current
        await pause(700)              // чекаємо поки crossfade завершиться
        mobileBannerCurrent.value = mobileBannerNext.value
        showNext.value = false        // прибираємо next (тепер current вже правильне)
        mobileBannerNext.value = null
    }
}

async function runLightningCycle() {
    await pause(1000)

    while (true) {
        await strike(0.2)
        await pause(600)
        await strike(0.5)
        await pause(600)
        await strike(0.8)
        await pause(3000) // пауза перед наступним циклом
    }
}

function pause(ms) {
    return new Promise(resolve => t(resolve, ms))
}

onMounted(() => {
    if (isMobile()) {
        runBannerCycle()
        runLightningCycle()
    } else {
        runCycle()
    }
})
onUnmounted(() => timers.forEach(clearTimeout))
</script>
  
<style lang="scss" scoped>
.hero {
    position: relative;
    width: 100%;
    flex-grow: 1;
    background: $cards-background-color;
    overflow: hidden;

    // --- Мобайл (base) ---

    &__mobile-banner {
        position: absolute;
        inset: 0;
        z-index: 1;

        img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            // filter: brightness(0.95);
        }
    }

    &__mobile-img--next {
        z-index: 2; // поверх current
    }

    &__mobile-slogan {
        position: absolute;
        bottom: 48px;
        left: 0;
        right: 0;
        z-index: 4;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        pointer-events: none;
        animation: vibrate 4s ease-in-out infinite; // ← додаємо
    }

    @keyframes vibrate {

        // більшість часу — спокій
        0%,
        75% {
            transform: translate(0, 0);
        }

        // удар — серія швидких зміщень
        76% {
            transform: translate(-3px, 1px);
        }

        77% {
            transform: translate(3px, -1px);
        }

        78% {
            transform: translate(-2px, 2px);
        }

        79% {
            transform: translate(2px, -2px);
        }

        80% {
            transform: translate(-1px, 1px);
        }

        81% {
            transform: translate(1px, 0px);
        }

        82% {
            transform: translate(0, 0);
        }

        // коротка пауза і ще один удар
        88% {
            transform: translate(0, 0);
        }

        89% {
            transform: translate(-2px, 1px);
        }

        90% {
            transform: translate(2px, -1px);
        }

        91% {
            transform: translate(-1px, 1px);
        }

        92% {
            transform: translate(0, 0);
        }

        100% {
            transform: translate(0, 0);
        }
    }

    &__mobile-word {
        display: block;
        font-size: 2.8rem;
        font-weight: 700;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        // Glow — імітація світіння від блискавки
        text-shadow:
            0 0 12px rgba(100, 160, 255, 0.9),
            0 0 30px rgba(100, 160, 255, 0.5),
            0 0 60px rgba(100, 160, 255, 0.2);
    }

    // --- Десктоп ---

    &__canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 3;
    }

    &__flash {
        position: absolute;
        inset: 0;
        background: white;
        opacity: 0;
        pointer-events: none;
        z-index: 1;
        transition: opacity 0.05s;
    }

    &__cols {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 40px;
        padding: 40px;
    }

    &__col {
        flex: 1;
        max-width: 380px;
        aspect-ratio: 1;
    }

    &__photo {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
    }

    &__slogan {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
        font-weight: 700;
        color: #fff;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        z-index: 4;
        text-shadow:
            0 0 12px rgba(100, 160, 255, 0.9),
            0 0 30px rgba(100, 160, 255, 0.5),
            0 0 60px rgba(100, 160, 255, 0.2);

        @media (max-width: 767px) {
            display: none; // ховаємо десктопні елементи на мобайлі
        }
    }

    .slogan-enter-active {
        transition: opacity 0.4s ease, transform 0.4s ease;
    }

    .slogan-leave-active {
        transition: opacity 0.4s ease;
    }

    .slogan-enter-from {
        opacity: 0;
        transform: scale(1.1);
    }

    .slogan-leave-to {
        opacity: 0;
    }

    &__banner {
        position: absolute;
        inset: 0;
        z-index: 3;
        overflow: hidden;
    }

    &__banner-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.photo-enter-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.photo-leave-active {
    transition: opacity 0.6s ease;
}

.photo-enter-from {
    opacity: 0;
    transform: scale(0.95);
}

.photo-leave-to {
    opacity: 0;
}



.banner-enter-active {
    transition: opacity 0.8s ease, transform 0.8s ease;
}

.banner-leave-active {
    transition: opacity 0.6s ease;
}

.banner-enter-from {
    opacity: 0;
    transform: scale(1.05);
}

.banner-leave-to {
    opacity: 0;
}

.crossfade-enter-active {
    transition: opacity 0.7s ease;
}

.crossfade-enter-from {
    opacity: 0;
}
</style>