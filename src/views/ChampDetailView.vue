<script setup lang="ts">
    import { ref } from 'vue';

    const searchQuery = ref('');

    function onSearch() {
        console.log('Search query:', searchQuery.value);
    }
</script>

<template>
        <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/champstats">Champs</RouterLink>
            <RouterLink to="/champdetail">Champ Detail</RouterLink>
        </nav>
        <div>
            <h1>test</h1>
        </div>
        <div>
            <input 
                type="text" 
                placeholder="Search..." 
                v-model="searchQuery" 
                @input="onSearch" 
            />
        </div>

        
</template>