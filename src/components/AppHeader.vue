<template>
    <header class="header">
        <div class="header__container container">
            <div class="header__right">
                <h2 class="header__title">NMR</h2>
            </div>
            <div class="header__center">
                <nav class="header__menu menu">
                    <ul class="menu__list">
                        <li class="menu__item"><router-link :to="{ name: 'Home' }">Home</router-link></li>
                        <li class="menu__item"><router-link :to="{ name: 'About' }">About</router-link></li>
                        <li class="menu__item"><router-link :to="{ name: 'Admin' }">Admin</router-link></li>
                    </ul>
                </nav>
            </div>
            <div class="header__right"></div>
        </div>
    </header>
</template>

<script setup>

</script>

<style lang="scss" scoped></style>