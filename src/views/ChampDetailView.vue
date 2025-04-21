<script setup lang="ts">
import { ref, type Ref, watch, onMounted } from "vue";
import Champions from "@/classes/Champion.ts"; 
import * as d3 from "d3";
// filepath: c:\Users\yoshu\Desktop\test\info-vis\src\views\ChampDetailView.vue
//import {ChampDetails} from "../data/ChampDetails.json";
import WinratePerMinute from '@/components/WinratePerMinute.vue';

interface ChampDetailsType {
    "average_assists": {[rank: string]: number}
    "average_deaths": {[rank: string]: number}
    "average_kills": {[rank: string]: number}
    //"average_positions": {[role: string]: number}
    // "highest_runes_usage:" string[]
    "id": number
    "losses": {[rank: string]: number}
    "name": string
    //"positions_played": {[role: string]: number}
    "total_assists": {[rank: string]: number}
    "total_deaths": {[rank: string]: number}
    "total_games": {[rank: string]: number}
    "total_kills": {[rank: string]: number}
    "winrate_at_times": {[minute: number]: number}
    "wins": {[rank: string]: number}
}

const champName = ref("");
const champion : Ref<Champions | undefined> = ref();
champName.value = "Bard"; 
champion.value = new Champions(champName.value); 
var champData: ChampDetailsType = {} as ChampDetailsType;
//drawMatchupGraph();

function searchChampion() {
    try {
        champion.value = undefined
        champion.value = new Champions(champName.value);
        console.log("Succes fetch champ");
        d3.json("http://localhost:5173/stats/champDetails2.json").then((data: any) => {
            champData = data.find((d: any) => d.name === champName.value);
            if (!champData) {
                console.warn("No data found for the selected champion: ", champName.value);
                return;
            }
            drawMatchupGraph()
            drawWinRatePerElo()
            drawWinsPerElo()
            drawKillsBarChart()
        }).catch((error) => {
            console.error("Error loading JSON data:", error);
        });
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

const rankOrder = ["Unranked", 
            "IRONIV", "IRONIII", "IRONII", "IRONI", 
            "BRONZEIV", "BRONZEIII", "BRONZEII", "BRONZEI",
            "SILVERIV", "SILVERIII", "SILVERII", "SILVERI", 
            "GOLDIV", "GOLDIII", "GOLDII", "GOLDI",
            "PLATINUMIV", "PLATINUMIII", "PLATINUMII", "PLATINUMI",
            "EMERALDIV", "EMERALDIII", "EMERALDII", "EMERALDI",
            "DIAMONDIV", "DIAMONDIII", "DIAMONDII", "DIAMONDI",
            "MASTERI", 
            "GRANDMASTERI", 
            "CHALLENGERI"];

const colorMapping: { [key: string]: string } = {
        "IRONI": "#a6a6a6",
        "IRONII": "#b3b3b3",
        "IRONIII": "#c0c0c0",
        "IRONIV": "#d9d9d9",
        "BRONZEI": "#cd7f32",
        "BRONZEII": "#d08c3a",
        "BRONZEIII": "#d39942",
        "BRONZEIV": "#d6a64a",
        "SILVERI": "#c0c0c0",
        "SILVERII": "#c4c4c4",
        "SILVERIII": "#c8c8c8",
        "SILVERIV": "#cccccc",
        "GOLDI": "#ffd700",
        "GOLDII": "#ffdb33",
        "GOLDIII": "#ffe066",
        "GOLDIV": "#ffe599",
        "PLATINUMI": "#00ff00",
        "PLATINUMII": "#33ff33",
        "PLATINUMIII": "#66ff66",
        "PLATINUMIV": "#99ff99",
        "EMERALDI": "#ffff00",
        "EMERALDII": "#ffff33",
        "EMERALDIII": "#ffff66",
        "EMERALDIV": "#ffff99",
        "DIAMONDI": "#00ffff",
        "DIAMONDII": "#33ffff",
        "DIAMONDIII": "#66ffff",
        "DIAMONDIV": "#99ffff",
        "MASTERI": "#ff00ff",
        "GRANDMASTERI": "#ff3399",
        "CHALLENGERI": "#ff6600",
};

function drawBarchartPerElo(divId: string, processedData: any[], y_label: string, y_scale: number[], lineValue: number) {
    const svgContainer = d3.select("#" + divId);
    svgContainer.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 70, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = svgContainer
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // remove 'all' from processedData
    const allIndex = processedData.findIndex((d) => d.name === "all");
    if (allIndex !== -1) {
        processedData.splice(allIndex, 1);
    }

    // Set up scales
    const x = d3.scaleBand()
        .domain(processedData.map((d) => d.name))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([y_scale[0], y_scale[1]])
        .range([height, 0]);

    // Add axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
    svg.append("g").call(d3.axisLeft(y));

    // Add bars
    svg.selectAll("rect")
        .data(processedData)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.name)!)
        .attr("y", (d) => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.value))
        .attr("fill", (d) => colorMapping[d.name] || "#69b3a2");

    // y label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(y_label)
        .style("fill", "white");

    svg.append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(lineValue))
        .attr("y2", y(lineValue))
        .attr("stroke", "grey")
        .attr("stroke-dasharray", "4 4")
        .attr("stroke-width", 2);
}

function drawWinRatePerElo() {
    const winsData = champData.wins;
    const gameCountData = champData.total_games;

    const sortedKeys = Object.keys(winsData).sort((a, b) => {
        return rankOrder.indexOf(a) - rankOrder.indexOf(b);
    });

    const processedData = sortedKeys.map((key: string) => ({
        name: key,
        value: winsData[key] / gameCountData[key] * 100, // Calculate win rate percentage
    }));

    drawBarchartPerElo("winrate-per-elo", processedData, "Win Rate (%)", [0,100], winsData["all"] / gameCountData["all"] * 100);
}

function drawWinsPerElo() {
    const winsData = champData.wins;

    const sortedKeys = Object.keys(winsData).sort((a, b) => {
        return rankOrder.indexOf(a) - rankOrder.indexOf(b);
    });

    const processedData = sortedKeys.map((key: string) => ({
        name: key,
        value: winsData[key],
    }));

    // remove 'all' from processedData
    const allIndex = processedData.findIndex((d) => d.name === "all");
    if (allIndex !== -1) {
        processedData.splice(allIndex, 1);
    }

    drawBarchartPerElo("wins-per-elo", processedData, "Total Wins", [0,d3.max(processedData, (d) => d.value)!], winsData["all"]);
}

function drawKillsBarChart() {
    const killsData = champData.average_kills;

    const sortedKeys = Object.keys(killsData).sort((a, b) => {
        return rankOrder.indexOf(a) - rankOrder.indexOf(b);
    });

    const processedData = sortedKeys.map((key: string) => ({
        name: key,
        value: killsData[key],
    }));

    // remove 'all' from processedData
    const allIndex = processedData.findIndex((d) => d.name === "all");
    if (allIndex !== -1) {
        processedData.splice(allIndex, 1);
    }

    drawBarchartPerElo("avg-kills-graph", processedData, "Avg Kills Per Game", [0,d3.max(processedData, (d) => d.value)!], 0);
}

onMounted(() => {
    drawMatchupGraph();
    drawWinRatePerElo();
    drawWinsPerElo();
    drawKillsBarChart();
});

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
                <div class="charts-container">
                    <div id="winrate-per-elo"></div>
                    <div id="wins-per-elo"></div>
                </div>
                <div id="avg-kills-graph"></div>
                
                
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

