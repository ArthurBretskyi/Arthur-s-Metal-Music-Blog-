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
                <span class="hero__mobile-word">Metal Up Your Ass</span>
            </div>
        </template>

        <!-- Десктоп -->
        <template v-else>
            <div class="hero__cols">
                <div class="hero__col" v-for="(col, index) in columns" :key="index">
                    <Transition name="photo">
                        <img v-if="col.showPhoto && col.src" :src="col.src" :alt="col.alt" class="hero__photo" />
                    </Transition>
                </div>
            </div>

            <div class="hero__slogan">Metal Up Your Ass</div>
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
import ozzy from '@/assets/pictures/home/Ozzy.png'
import nergal from '@/assets/pictures/home/Nergal.png'
import peter from '@/assets/pictures/home/Peter Steele.png'
import joe from '@/assets/pictures/home/Joe Duplantier.png'
import fisher from '@/assets/pictures/home/George Corpsegrinder Fisher.png'
import sigurd from '@/assets/pictures/home/Sigurd Wongraven.png'
import semargl from '@/assets/pictures/home/Semargl.png'
import shagrath from '@/assets/pictures/home/Shagrath.png'
import master from '@/assets/pictures/home/master-of-puppets.png'
import rust from '@/assets/pictures/home/Rust In Peace.png'
import beast from '@/assets/pictures/home/number-of-the-beast.png'
import reign from '@/assets/pictures/home/reign-in-blood.png'
import filosofem from '@/assets/pictures/home/filosofem.png'
import vulgar from '@/assets/pictures/home/Vulgar Display of Power.png'
import thelema from '@/assets/pictures/home/Thelema.png'
import obs from '@/assets/pictures/home/OBS.jpg'
import sirius from '@/assets/pictures/home/FROM MARS TO SIRIUS.png'
import sathanas from '@/assets/pictures/home/De-Mysteriis-Dom-Sathanas.png'
import cannibal from '@/assets/pictures/home/cannibal-corpse.png'
import medieval from '@/assets/pictures/home/medieval.png'
import cruelty from '@/assets/pictures/home/cruelty and the beast.png'
import spiritual from '@/assets/pictures/home/Spiritual Black Dimensions.png'

const items = [
    { src: dave, alt: 'Dave Mustaine' },
    { src: james, alt: 'James Hetfield' },
    { src: tom, alt: 'Tom Araya' },
    { src: bruce, alt: 'Bruce Dickinson' },
    { src: varg, alt: 'Varg Vikernes' },
    { src: dime, alt: 'Dime' },
    { src: rob, alt: 'Rob Halford' },
    { src: ozzy, alt: 'Ozzy' },
    { src: nergal, alt: 'Nergal' },
    { src: peter, alt: 'Peter Steele' },
    { src: joe, alt: 'Joe Duplantier' },
    { src: fisher, alt: 'George Corpsegrinder Fisher' },
    { src: sigurd, alt: 'Sigurd Wongraven' },
    { src: semargl, alt: 'Semargl' },
    { src: shagrath, alt: 'Shagrath' },
    { src: master, alt: 'master of puppets' },
    { src: rust, alt: 'Rust In Peace' },
    { src: beast, alt: 'number of the beast' },
    { src: reign, alt: 'reign in blood' },
    { src: filosofem, alt: 'filosofem' },
    { src: vulgar, alt: 'vulgar display of power' },
    { src: thelema, alt: 'thelema' },
    { src: obs, alt: 'obs' },
    { src: sirius, alt: 'sirius' },
    { src: sathanas, alt: 'sathanas' },
    { src: cannibal, alt: 'cannibal' },
    { src: medieval, alt: 'Dark Medieval Times' },
    { src: cruelty, alt: 'cruelty and the beast' },
    { src: spiritual, alt: 'Spiritual Black Dimensions' },
]

const canvasRef = ref(null)
const flashRef = ref(null)
const timers = []

const isMobile = () => window.matchMedia('(max-width: 767px)').matches

const columns = reactive([
    { src: null, alt: '', showPhoto: false },
    { src: null, alt: '', showPhoto: false },
    { src: null, alt: '', showPhoto: false },
])

const mobileBannerCurrent = ref(null)
const mobileBannerNext = ref(null)
const showNext = ref(false)

// ---- Послідовності колонок ----
const sequences = [
    [0, 1, 2],
    [1, 2, 0],
    [2, 0, 1],
    [0, 2, 1],
    [2, 1, 0],
    [1, 0, 2],
]
let seqIndex = 0
let itemIndex = 0

function nextItem() {
    const item = items[itemIndex]
    itemIndex = (itemIndex + 1) % items.length
    return item
}

function nextSequence() {
    const seq = sequences[seqIndex]
    seqIndex = (seqIndex + 1) % sequences.length
    return seq
}

function t(fn, delay) {
    timers.push(setTimeout(fn, delay))
}

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

        drawBolt(ctx, mainPts, 0.15, 18, '#6699ff')
        drawBolt(ctx, mainPts, 0.25, 8, '#88bbff')
        drawBolt(ctx, mainPts, 0.9, 2, '#ddeeff')
        drawBolt(ctx, mainPts, 0.7, 1, '#ffffff')

        for (let i = 1; i < mainPts.length - 1; i += 3) {
            if (Math.random() > 0.65) {
                const dir = Math.random() > 0.5 ? 1 : -1
                const angle = Math.PI / 2 + dir * randBetween(0.3, 0.9)
                drawBranch(ctx, mainPts[i][0], mainPts[i][1], angle, randBetween(20, 60), 3)
            }
        }

        flash.style.opacity = '0.1'
        t(() => { flash.style.opacity = '0.04' }, 50)
        t(() => { flash.style.opacity = '0.08' }, 100)
        t(() => { flash.style.opacity = '0' }, 180)

        let alpha = 1
        const fadeInterval = setInterval(() => {
            alpha -= 0.06
            if (alpha <= 0) {
                clearInterval(fadeInterval)
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                resolve()
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

// ---- Десктоп ----

async function runCycle() {
    // Перший запуск — заповнюємо всі три колонки
    const firstSeq = nextSequence()
    for (const colIndex of firstSeq) {
        await strike(0.2 + colIndex * 0.3)
        const item = nextItem()
        columns[colIndex].src = item.src
        columns[colIndex].alt = item.alt
        columns[colIndex].showPhoto = true
        await pause(500)
    }

    // Далі — нескінченне оновлення по одній колонці
    while (true) {
        await pause(2000)

        const seq = nextSequence()

        for (const colIndex of seq) {
            // Стара зникає
            columns[colIndex].showPhoto = false
            await pause(400) // чекаємо поки transition завершиться

            // Нова з'являється
            await strike(0.2 + colIndex * 0.3)
            const item = nextItem()
            columns[colIndex].src = item.src
            columns[colIndex].alt = item.alt
            columns[colIndex].showPhoto = true
            await pause(500)
        }
    }
}

// ---- Мобайл ----

async function runBannerCycle() {
    mobileBannerCurrent.value = items[Math.floor(Math.random() * items.length)]

    while (true) {
        await pause(4000)
        let next
        do {
            next = items[Math.floor(Math.random() * items.length)]
        } while (next === mobileBannerCurrent.value)

        mobileBannerNext.value = next
        showNext.value = true
        await pause(700)
        mobileBannerCurrent.value = mobileBannerNext.value
        showNext.value = false
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
        await pause(3000)
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
        }
    }

    &__mobile-img--next {
        z-index: 2;
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
        animation: vibrate 4s ease-in-out infinite;
    }

    @keyframes vibrate {

        0%,
        75% {
            transform: translate(0, 0);
        }

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

        92%,
        100% {
            transform: translate(0, 0);
        }
    }

    &__mobile-word {
        display: block;
        font-size: $lg;
        font-weight: 700;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 0.12em;
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
        gap: 20px;
    }

    &__col {
        height: 100%;
        flex: 1;
        max-width: 100%;
        aspect-ratio: 1;
    }

    &__photo {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
        box-shadow: 0 0 12px $accent-color;
    }

    &__slogan {
        position: absolute;
        bottom: 48px;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
        font-weight: 700;
        color: #fff;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        z-index: 4;
        pointer-events: none;
        text-shadow:
            0 0 12px rgba(100, 160, 255, 0.9),
            0 0 30px rgba(100, 160, 255, 0.5),
            0 0 60px rgba(100, 160, 255, 0.2);
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

.crossfade-enter-active {
    transition: opacity 0.7s ease;
}

.crossfade-enter-from {
    opacity: 0;
}
</style>