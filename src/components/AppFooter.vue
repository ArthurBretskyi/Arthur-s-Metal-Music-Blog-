<template>
    <footer class="footer">
        <div class="footer__container">
            <p>&copy; {{ new Date().getFullYear() }} Arthur's Metal Music Blog. All rights reserved.</p>
        </div>
    </footer>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.footer {

    &__container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 66px;
    }
}
</style>