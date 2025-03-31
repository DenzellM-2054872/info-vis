<script setup lang="ts">
// filepath: c:\Users\yoshu\Desktop\test\info-vis\src\views\ChampDetailView.vue
import { defineComponent, ref, type Ref } from "vue";
import Champions from "@/classes/Champion.ts"; 
const champName = ref("");
const champion : Ref<Champions | undefined> = ref();
function searchChampion() {
    try {
        champion.value = undefined
        champion.value = new Champions(champName.value);
        console.error("Succes");
    } catch (error) {
        console.error("Error fetching champion:", error);
    }
}


</script>
<template>
    <div>
        <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/champstats">Champs</RouterLink>
            <RouterLink to="/champdetail">Champ Detail</RouterLink>
        </nav>
        <div>
            <input 
                type="text" 
                v-model="champName" 
                placeholder="Search Champion" 
                @keyup.enter="searchChampion"
            />
            <button @click="searchChampion">Search</button>
        </div>
        <div v-if="champion" class="champion-container">
            <div class="champion-header">
                <img :src="champion.getPortraitPath()" class="champion-image" />
                <div class="champion-info">
                    <h1>{{ champion.getName() }}</h1>
                    <p class="champion-class">{{ champion.getClass().join(', ') }}</p>
                    <div class="abilities-container">
                        <div v-for="(ability, index) in champion.getSpells()" :key="index" class="ability">
                            <img :src="`/spell/${ability.image.full}`" alt="Ability Image" class="ability-icon" />
                            <p>{{ ability.name }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <p>No champion selected or found.</p>
        </div>
    </div>
</template>

<style scoped>
.champion-container {
    border: 1px solid #ccc;
    padding: 16px;
    border-radius: 8px;
    max-width: 800px;
    margin: 0 auto;
    background-color: #181818;
}

.champion-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
}

.champion-image {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
}

.champion-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.champion-info h1 {
    margin: 0;
    font-size: 1.5rem;
}

.champion-class {
    margin: 0;
    font-size: 0.9rem;
    color: #aaa;
}

.abilities-container {
    display: flex;
    gap: 8px;
    margin-top: 8px;
}

.ability-icon {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    object-fit: cover;
    border: 1px solid #ccc;
}
</style>

