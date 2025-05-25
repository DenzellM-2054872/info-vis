<script setup lang="ts">
import Abilities from "@/components/abilities.vue";
import ChampDetail from "@/components/ChampDetail.vue";

</script>

<template>
    <div class="content">
        <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/champstats">Champs</RouterLink>
            <RouterLink to="/champdetail">Champ Details</RouterLink>
            <RouterLink to="/gamedetail">Game Details</RouterLink>
        </nav>
        <ChampDetail />


    </div>
</template>

<style scoped>
.content{
    align-items: center;
}
.search-container {
    margin-top: 25px;
    margin-bottom: 10px;
}
.matchup-graph {
    display: flex;
    justify-content: space-between;
    align-items: center; /* Center boxes vertically */

    margin-top: 16px;
}

.matchup-box {
    flex: 1;
    text-align: center;
    padding: 16px;
    border-radius: 8px;
    cursor: pointer;
    color: white;
    font-weight: bold;
    transition: transform 0.2s ease, box-shadow 0.2s ease, clip-path 0.2s ease;
}

.matchup-box:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

#champion-list {
    margin-top: 10px;
    display: flex;
    justify-content: center;
}

.champion-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 12px;
    max-width: 600px;
    width: 100%;
}

.champion-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    padding: 4px;
    text-align: center;
    color: white;
    font-size: 0.75rem;
    transition: transform 0.2s ease;
}

.champion-card:hover {
    transform: scale(1.5);
    background-color: rgba(255, 255, 255, 0.1);
}

.champion-card img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 6px;
}



.champ-name {
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.champ-stats {
    font-size: 0.65rem;
    opacity: 0.8;
}

.champion-card p {
    margin: 4px 0 0;
    font-size: 0.75rem;
    color: #fff;
    text-align: center;
}
.champion-container {
    border: 1px solid #ccc;
    padding: 16px;
    border-radius: 8px;
    margin: 0 auto;
    background-color: #181818;
    display: flex;
    flex-direction: column;
}

.champion-header {
    display: flex;
    align-items: center;
    gap: 24px; 
    margin-bottom: 24px; 
}

.champion-image {
    width: 120px; 
    height: 120px; 
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
    font-size: 2rem; 
}

.champion-class {
    margin: 0;
    font-size: 1.2rem;
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

.charts-container {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    width: 100%; /* Ensure it takes full width */
    max-width: 100%; /* Prevent overflow */
    box-sizing: border-box; /* Include padding in width calculation */
}

#winrate-per-elo,
#avg-kills-graph {
    flex: 1; /* Make both charts take equal space */
    max-width: 48%; /* Ensure they fit side by side */
    min-width: 0; /* Prevent flexbox from forcing a minimum size */
}


</style>

