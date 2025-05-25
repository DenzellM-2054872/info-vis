<template>
    <div id="ChampDetail">
        <div class="search-container">
            <input
                type="text"
                v-model="champName"
                placeholder="Search Champion"
                @keyup.enter="searchChampion"
            />
            <button @click="searchChampion">Search</button>

            <select name="rank" id="rank" v-model="rank" @change="setRank">
                <option value="all">All</option>
                <option value="IRON">Iron</option>
                <option value="BRONZE">Bronze</option>
                <option value="GOLD">Gold</option>
                <option value="PLATINUM">Platinum</option>
                <option value="EMERALD">Emerald</option>
                <option value="DIAMOND">Diamond</option>
                <option value="MASTER">Master</option>
                <option value="GRANDMASTER">Grandmaster</option>
            </select>
        </div>
        <div v-if="champion" class="champion-container">
                <div class="champion-header">
                    <img :src="champion!.getPortraitPath()" class="champion-image" />
                    <div class="champion-info">
                        <h1>{{ champion!.getName() }}</h1>
                        <p class="champion-class">{{ champion!.getClass().join(', ') }}</p>
                        <p> {{ }}</p>
                        <div class="abilities-container">
                            <div v-for="(ability, index) in champion!.getSpells()" :key="index" class="ability">
                                <img :src="`/spell/${ability.image.full}`" alt="Ability Image" class="ability-icon" />
                            </div>
                        </div>
                    </div>
                </div>
                <AbilityComp v-if="abilityStats"
                    ref="abilityComp"
                    :champStats = "abilityStats"
                    :champion = champion />

                <RuneUsage id="rune-usage" ref="RuneUsage" v-if="champDataSet" :runes="champData?.highest_runes_usage" :key="champData?.id"/>

                <div id="positions-graph"></div>
                <ChampMatchup ref="ChampMatchup" v-if="champStatsSet && champStats" :champStats="champStats!" :key="champStats?.name"/>
                <div v-else>
                    <p>Loading champion...</p>
                </div>
                <EloBarcharts ref="EloBarcharts" v-if="champDataSet && champData" :champData="champData!" :key="champData?.id"/>
                <div v-else>
                    <p>Loading champion...</p>
                </div>
        </div>
        <div v-else>
            <p>No champion selected or found.</p>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, useTemplateRef, type Ref } from "vue";
import Champions from "@/classes/Champion.ts";
import * as d3 from "d3";
import EloBarcharts from '@/components/EloBarcharts.vue';
import ChampMatchup from '@/components/ChampMatchup.vue';
import AbilityComp from '@/components/AbilityComp.vue';
import RuneUsage from "@/components/RuneUsage.vue";

class AbilitiyData{
    champs: {[key:string]: ChampAbilities} = {}
}

class ChampAbilities{
    rank: {[key: string]: {[order: number]: {[ability: string]: {wins: number, losses: number}}}} = {}
}


interface ChampDetailsType {
    "average_assists": {[rank: string]: number}
    "average_deaths": {[rank: string]: number}
    "average_kills": {[rank: string]: number}
    "average_positions": {[rank: string]: {[role: string]: number}}
    "highest_runes_usage": {[rank: string]: {[runes: string]: number}}
    "id": number
    "losses": {[rank: string]: number}
    "name": string
    "positions_played": {[rank: string]: {[role: string]: number}}
    "total_assists": {[rank: string]: number}
    "total_deaths": {[rank: string]: number}
    "total_games": {[rank: string]: number}
    "total_kills": {[rank: string]: number}
    "winrate_at_times": {[minute: string]: number}
    "wins": {[rank: string]: number}
}

interface ChampionStats {
    name: string;
    games: number;
    wins: number;
    losses: number;
    bans: number;
    effectiveBans: number;
}

export default{
    name: "ChampDetail",
    components: {
        EloBarcharts,
        ChampMatchup,
        AbilityComp,
        RuneUsage
    },
    setup(){
        const abilityStats = ref<ChampAbilities | null>(null);
        const champName = ref("");
        const champion: Ref<Champions | undefined> = ref();
        const champData = ref<ChampDetailsType | null>(null);
        const champStats = ref<ChampionStats | null>(null);

        const abilityComp = useTemplateRef<typeof AbilityComp>('abilityComp');

        var champDataSet = ref(false);
        var champStatsSet = ref(false);
        var rank = ref('all')

        return {
            abilityStats,
            abilityComp,
            champName,
            champion,
            champData,
            champStats,
            champDataSet,
            champStatsSet,
            rank
        };
    },
    methods: {
        setRank(){
            this.abilityComp?.setRank(this.rank)
        },
        searchChampion() {
            try {
                d3.json("http://localhost:5173/stats/wbpr.json")
                    .then((globalData: any) => {
                        const foundData: ChampionStats = globalData["all"][this.champName];
                        if (!foundData) {
                            console.warn("No stats found for the selected champion: ", this.champName);
                            return;
                        }
                        this.champStats! = foundData;
                        this.champStats.name = this.champName; // Ensure champName is set
                        this.champStatsSet = true;
                        //console.log("champStats", this.champStats);
                    })
                    .catch((error) => {
                        console.error("Error loading JSON data:", error);
                    });
                d3.json("http://localhost:5173/stats/champDetails3.json")
                    .then((data: any) => {
                        const foundData: ChampDetailsType = data.find((d: any) => d.name === this.champName);
                        if (!foundData) {
                            console.warn("No data found for the selected champion: ", this.champName);
                            return;
                        }
                        this.champData! = foundData; // Update reactive champData
                        this.champDataSet = true;
                        //console.log("champData", this.champData);
                    }).catch((error) => {
                        console.error("Error loading JSON data:", error);
                    });

                d3.json("http://localhost:5173/stats/abilities.json")
                    .then((data: any) => {
                        const typedData: AbilitiyData = data;
                        const foundData: ChampAbilities = typedData.champs[this.champName];
                        if (!foundData) {
                            console.warn("No data found for the selected champion: ", this.champName);
                            return;
                        }
                        this.abilityStats! = foundData; // Update reactive champData
                        console.log("AbilityData", this.abilityStats);
                        this.$forceUpdate();
                    }).catch((error) => {
                        console.error("Error loading JSON data:", error);
                    });

                this.champion = undefined
                this.champion = new Champions(this.champName);

            } catch (error) {
                console.error("Error fetching champion:", error);
            }
        },
    },
    mounted(){
    }
}
</script>

<style scoped>
.rune-usage {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.content{
    align-items: center;
}
.search-container {
    margin-top: 25px;
    margin-bottom: 10px;
    justify-content: center;
    display: flex;
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
    margin-bottom: 28px;
  justify-content: center;
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
