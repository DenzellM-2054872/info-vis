<script setup lang="ts">
import ChampScatter from '@/components/ChampScatter.vue';
import BannedScatter from '@/components/BannedScatter.vue';
</script>

<template>
        <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/champstats">Champs</RouterLink>
        </nav>
        <BannedScatter />
        <ChampScatter />
</template>

