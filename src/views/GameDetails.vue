<script setup lang="ts">

import WinRate from '@/components/WinRate.vue';
</script>

<template>
    <div class="content">
        <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/champstats">Champs</RouterLink>
            <RouterLink to="/champdetail">Champ Details</RouterLink>
            <RouterLink to="/gamedetail">Game Details</RouterLink>
        </nav>
        <WinRate />
    </div>
</template>


<style lang="scss" scoped>
.content{
    display: flex;
    flex-direction: column;
    max-width: inherit;
    width: 1280px;
    align-items: center;
}   
</style>
