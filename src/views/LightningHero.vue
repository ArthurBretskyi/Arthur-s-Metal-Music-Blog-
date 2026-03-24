<template>
    <div class="hero">
        <canvas ref="canvasRef" class="hero__canvas"></canvas>
        <div class="hero__flash" ref="flashRef"></div>

        <div class="hero__cols">
            <div class="hero__col" v-for="(item, index) in currentItems" :key="index">
                <Transition name="photo">
                    <img v-if="item.showPhoto" :src="item.src" :alt="item.alt" class="hero__photo" />
                </Transition>
            </div>
        </div>
        <Transition name="slogan">
            <div v-if="showSlogan" class="hero__slogan">Metal Up Your Ass</div>
        </Transition>
    </div>
</template>
  
<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'

import dave from '@/assets/pictures/home/Dave Mustaine.png'
import james from '@/assets/pictures/home/James Hetfield.png'
import tom from '@/assets/pictures/home/Tom Araya.png'
import master from '@/assets/pictures/home/master-of-puppets.WEBP'
import rust from '@/assets/pictures/home/Rust In Peace.jpg'
import beast from '@/assets/pictures/home/number-of-the-beast.WEBP'

const items = reactive([
    { src: dave, alt: 'Dave Mustaine', showPhoto: false },
    { src: james, alt: 'James Hetfield', showPhoto: false },
    { src: tom, alt: 'Tom Araya', showPhoto: false },
    { src: master, alt: 'master of puppets', showPhoto: false },
    { src: rust, alt: 'Rust In Peace', showPhoto: false },
    { src: beast, alt: 'number of the beast', showPhoto: false },
])

const canvasRef = ref(null)
const flashRef = ref(null)
const timers = []

const showSlogan = ref(false)

const currentItems = ref([])

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

    for (let i = 0; i < currentItems.value.length; i++) {
        await strike(0.2 + i * 0.3)
        currentItems.value[i].showPhoto = true
        await pause(500)
    }

    await pause(HOLD)

    // Показуємо напис
    showSlogan.value = true
    await pause(1500)
    showSlogan.value = false
    await pause(300)

    for (let i = 0; i < currentItems.value.length; i++) {
        currentItems.value[i].showPhoto = false
        await pause(FADE)
    }

    await pause(500)
    runCycle()
}

function pause(ms) {
    return new Promise(resolve => t(resolve, ms))
}

onMounted(() => runCycle())
onUnmounted(() => timers.forEach(clearTimeout))
</script>
  
<style lang="scss" scoped>
.hero {
    position: relative;
    width: 100%;
    flex-grow: 1;
    background: #080810;
    overflow: hidden;

    &__canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
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
        max-width: 280px;
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
</style>