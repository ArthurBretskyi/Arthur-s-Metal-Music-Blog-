<template>
    <div class="about">
        <div class="about__container">
            <p class="about__text">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur expedita dicta omnis eius in,
                possimus aliquid quia ipsam quam! Doloremque nostrum beatae cum soluta corrupti vero explicabo odio
                perspiciatis, sequi minima possimus quis, aliquid nulla inventore velit. Nisi quis velit molestiae maxime
                reiciendis at facere corporis quisquam rerum! Quis, facere?
            </p>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.about {
    min-height: calc(100vh - $header-height);
    background-color: $background-color;
    padding: $spacing-lg $spacing-md;

    &__container {
        max-width: 800px;
        margin: 0 auto;
    }

    &__text {
        font-size: $lg;
        text-align: center;
    }
}
</style>