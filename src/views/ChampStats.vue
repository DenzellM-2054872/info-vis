<script setup lang="ts">
import DualScatter from '@/components/DualScatter.vue';
import SynergyComp from '@/components/SynergyComp.vue';
</script>

<template>
    <div class="content">
        <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/champstats">Champs</RouterLink>
            <RouterLink to="/champdetail">Champ Details</RouterLink>
        </nav>
        <DualScatter />
        <SynergyComp />
    </div>
</template>


<style lang="scss" scoped>
.content{
    display: flex;
    flex-direction: column;
}
</style>
