<script setup lang="ts">

import WinRate from '@/components/WinRate.vue';
</script>

<template>
    <div class="content">
        <nav>
            <RouterLink to="/">About</RouterLink>
            <RouterLink to="/champscatter">Champ Scatter</RouterLink>
            <RouterLink to="/synergy">Teambuilder</RouterLink>
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
    align-items: center;
    width: 100%;
    color: white;
}   
</style>
