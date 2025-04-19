<script setup lang="ts">
import { ref, type Ref, watch } from "vue";
import Champions from "@/classes/Champion.ts"; 
import * as d3 from "d3";

const champName = ref("");
const champion : Ref<Champions | undefined> = ref();
champName.value = "Bard"; 
champion.value = new Champions(champName.value); 
drawMatchupGraph();

function searchChampion() {
    try {
        champion.value = undefined
        champion.value = new Champions(champName.value);
        console.log("Succes fetch champ");
        drawMatchupGraph()
    } catch (error) {
        console.error("Error fetching champion:", error);
    }
}
function drawMatchupGraph() {
    if (!champion.value) return;

    const svgContainer = d3.select("#matchup-graph");
    svgContainer.selectAll("*").remove(); // Clear previous graph

    const margin = { top: 20, right: 80, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = svgContainer
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Load the global win rate data
    d3.csv("http://localhost:5173/stats/wo_lanes/global_wbpr.csv").then((globalData) => {
        const champGlobalData = globalData.find((d) => d.Name === champName.value);
        if (!champGlobalData) {
            console.warn("No global data found for the selected champion: ", champion.value?.getName());
            return;
        }

        const champAverageWR = parseFloat(champGlobalData.WR); 
        const champTotalGames = parseInt(champGlobalData.Games); 
        //const minGamesThreshold = champTotalGames < 12500 ? Math.max(0, champTotalGames * 0.3) : Math.max(350, champTotalGames * 0.02); 
        //const minGamesThreshold = champTotalGames < 15000 ? champTotalGames * 0.01 : champTotalGames * 0.01;
        const minGamesThreshold = 0;
        const lowerBound = champAverageWR - 2.5; 
        const upperBound = champAverageWR + 2.5; 
        console.log("Champ Average WR:", champAverageWR);
        console.log("Champ Total Games:", champTotalGames);
        // Load the matchup data
        d3.csv("http://localhost:5173/stats/wo_lanes/global_globalWR.csv").then((matchupData) => {
            
            const filteredData = matchupData.filter((d) => {
                const wr = parseFloat(d.WR);
                const games = parseInt(d.Games, 10);
                return (
                    d.Name === champName.value &&
                    (wr <= lowerBound ||
                    wr >= upperBound) &&
                    games >= minGamesThreshold 
                );
            });

            if (filteredData.length === 0) {
                console.warn("No matchups found within the specified WR range and game count.");
                return;
            }

            // Sort data 
            filteredData.sort((a, b) => parseFloat(a.WR) - parseFloat(b.WR));

            const x = d3.scaleBand()
                .domain(filteredData.map((d) => d.Opponent))
                .range([0, width])
                .padding(0.2);

            const y = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);

            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end");

            svg.append("g").call(d3.axisLeft(y));

            svg.selectAll("rect")
                .data(filteredData)
                .enter()
                .append("rect")
                .attr("x", (d) => x(d.Opponent)!)
                .attr("y", (d) => y(parseFloat(d.WR)))
                .attr("width", x.bandwidth())
                .attr("height", (d) => height - y(parseFloat(d.WR)))
                .attr("fill", (d) => (parseFloat(d.WR) > champAverageWR ? "#69b3a2" : "#ff6b6b"));

            svg.append("line")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", y(champAverageWR))
                .attr("y2", y(champAverageWR))
                .attr("stroke", "grey")
                .attr("stroke-dasharray", "4 4")
                .attr("stroke-width", 2);

            svg.append("text")
                .attr("x", width + 1)
                .attr("y", y(champAverageWR))
                .attr("text-anchor", "start")
                .style("fill", "red")
                .style("font-size", "12px")
                .text(`Avg: ${champAverageWR.toFixed(2)}%`);
        }).catch((error) => {
            console.error("Error loading matchup data:", error);
        });
    }).catch((error) => {
        console.error("Error loading global data:", error);
    });
}

function getChampionCounters() {
    if (champion.value) {
        
    }
    return "No counters available";
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
                            </div>
                        </div>
                    </div>
                </div>
                <div id="matchup-graph"></div>

                
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
</style>

