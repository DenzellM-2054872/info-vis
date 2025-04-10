<script setup lang="ts">
import DualScatter from '@/components/DualScatter.vue';
</script>

<template>
        <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/champstats">Champs</RouterLink>
            <RouterLink to="/champdetail">Champ Details</RouterLink>
        </nav>
        <DualScatter />
</template>

