<script setup lang="ts">
import DualScatter from '@/components/DualScatter.vue';
import SynergyComp from '@/components/SynergyComp.vue';
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

        <DualScatter />
    </div>
</template>


<style lang="scss" scoped>

#app{
    width: 80%;
    justify-content: center;
}

</style>
