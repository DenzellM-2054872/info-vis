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
    "average_positions": {[role: string]: number}[]
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

interface ChampionStats {
    //Name: string;
    games: number;
    wins: number;
    losses: number;
    bans: number;
    effectiveBans: number;
    //WR: number;
}

const champName = ref("");
const champion : Ref<Champions | undefined> = ref();
//const searchbar = useTemplateRef<ChampSearch>("champSearch");
var champData: ChampDetailsType = {} as ChampDetailsType;
//drawMatchupGraph();
var champStats: ChampionStats = {} as ChampionStats;

function searchChampion() {
    try {
        champion.value = undefined
        champion.value = new Champions(champName.value);
        console.log("Succes fetch champ");
        d3.json("http://localhost:5173/stats/wbpr.json")
            .then((globalData: any) => {
                champStats = globalData["all"][champName.value];
                // if (!foundStats) {
                //     console.warn("No data found for the selected champion: ", champion.value?.getName());
                //     return;
                // }
                // champStats.value = foundStats; 
                console.log(champStats);
                drawMatchupGraph()
            })
            .catch((error) => {
                console.error("Error loading CSV data:", error);
            });
        d3.json("http://localhost:5173/stats/champDetails3.json").then((data: any) => {
            champData = data.find((d: any) => d.name === champName.value);
            if (!champData) {
                console.warn("No data found for the selected champion: ", champName.value);
                return;
            }
            console.log("i'm testing here", champData)
            drawPositions()
            drawWinRatePerElo()
            drawWinsPerElo()
            drawKDABarCharts()
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
    const height = 200; // Increased height for the hourglass effect

    const svg = svgContainer
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Load the global win rate data
       
    const champAverageWR = champStats.wins/champStats.games * 100 || 0;
    const champTotalGames = champStats.games || 0;
    const minGamesThreshold = champTotalGames < 12500 ? Math.max(0, champTotalGames * 0.3) : Math.max(350, champTotalGames * 0.02);

    const bounds = [
        { label: "-7.5", range: [champAverageWR - 7.5, champAverageWR - 5], scale: 1.5 },
        { label: "-5", range: [champAverageWR - 5, champAverageWR - 2.5], scale: 1.2 },
        { label: "-2.5", range: [champAverageWR - 2.5, champAverageWR], scale: 1 },
        { label: "+2.5", range: [champAverageWR, champAverageWR + 2.5], scale: 1 },
        { label: "+5", range: [champAverageWR + 2.5, champAverageWR + 5], scale: 1.2 },
        { label: "+7.5", range: [champAverageWR + 5, champAverageWR + 7.5], scale: 1.5 },
    ];

    // Load matchup data
    d3.csv("http://localhost:5173/stats/wo_lanes/global_globalWR.csv").then((matchupData) => {
        const groupedData = bounds.map((bound) => {
            const filtered = matchupData.filter((d) => {
                const wr = parseFloat(d.WR);
                const games = parseInt(d.Games, 10);
                return (
                    d.Name === champName.value &&
                    wr >= bound.range[0] &&
                    wr < bound.range[1] &&
                    games >= minGamesThreshold
                );
            });
            return { label: bound.label, champions: filtered, size: Math.abs(bound.range[1] - bound.range[0]), scale: bound.scale };
        });

        const totalSize = groupedData.reduce((sum, d) => sum + d.size * d.scale, 0);
        const scaleFactor = width / totalSize; // Scale blocks 

        let currentX = 0;

        // Create blocks 
        svg.selectAll("rect")
            .data(groupedData)
            .enter()
            .append("rect")
            .attr("x", (d) => {
                const x = currentX;
                currentX += d.size * d.scale * scaleFactor;
                return x;
            })
            .attr("y", (d) => {
                // Change y
                const centerY = height / 2;
                return centerY - (d.scale * 40); 
            })
            .attr("width", (d) => d.size * d.scale * scaleFactor)
            .attr("height", (d) => d.scale * 80) 
            .attr("fill", (d) =>
                d.label.includes("-") ? "#ff6b6b" : "#69b3a2"
            )
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("rx", 20) // Round corners 
            .attr("ry", 20) // Round corners 
            .on("click", (event, d) => {
                displayChampionList(d.champions);
            });

        // Labels
        currentX = 0;
        svg.selectAll("text")
            .data(groupedData)
            .enter()
            .append("text")
            .attr("x", (d) => {
                const x = currentX + (d.size * d.scale * scaleFactor) / 2;
                currentX += d.size * d.scale * scaleFactor;
                return x;
            })
            .attr("y", (d) => {
                const centerY = height / 2;
                return centerY - (d.scale * 40) + (d.scale * 40); 
            })
            .attr("text-anchor", "middle")
            .text((d) => d.label)
            .attr("fill", "white");
    }).catch((error) => {
        console.error("Error loading matchup data:", error);
    });
    
}

// Display the list in group
function displayChampionList(champions: d3.DSVRowString<string>[]) {
    const listContainer = d3.select("#champion-list");
    listContainer.selectAll("*").remove(); // Clear

    if (champions.length === 0) {
        listContainer.append("p").text("No champions.");
        return;
    }

    const list = listContainer.append("ul");
    champions.forEach((champ: d3.DSVRowString<string>) => {
        const realName = Champions.NamefromID(champ.Opponent);
        list.append("li").text(`${realName}: ${champ.WR}%`);
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
        "IRONI": "#706667",
        "IRONII": "#9e9798",
        "IRONIII": "#ccc8c8",
        "IRONIV": "#f2f1f1",
        "BRONZEI": "#8a7571",
        "BRONZEII": "#a69794",
        "BRONZEIII": "#c0b5b3",
        "BRONZEIV": "#d5cecd",
        "SILVERI": "#a6b0b8",
        "SILVERII": "#c3c9ce",
        "SILVERIII": "#dfe3e5",
        "SILVERIV": "#f7f8f8",
        "GOLDI": "#ae8f62",
        "GOLDII": "#c8b394",
        "GOLDIII": "#e2d7c7",
        "GOLDIV": "#f7f4f0",
        "PLATINUMI": "#417a85",
        "PLATINUMII": "#7ea5ac",
        "PLATINUMIII": "#bbcfd3",
        "PLATINUMIV": "#edf2f3",
        "EMERALDI": "#2f815e",
        "EMERALDII": "#72a991",
        "EMERALDIII": "#b4d2c5",
        "EMERALDIV": "#ebf3f0",
        "DIAMONDI": "#6486ca",
        "DIAMONDII": "#95addb",
        "DIAMONDIII": "#c7d3ec",
        "DIAMONDIV": "#f0f4fa",
        "MASTERI": "#b178b9",
        "GRANDMASTERI": "#b04e4b",
        "CHALLENGERI": "#8fcde4",
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

function drawSpiderChart(divId: string) {
    let data = [];
    let features: string[] = ["A", "B", "C", "D", "E"];
    //generate the data
    for (var i = 0; i < 3; i++){
        var point: {[s: string]: number} = {}
        //each feature will be a random number from 1-9
        features.forEach(f => point[f] = 1 + Math.random() * 8);
        data.push(point);
    }

    const svgContainer = d3.select("#" + divId);
    svgContainer.selectAll("*").remove();

    const margin = { top: 100, right: 30, bottom: 100, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = svgContainer
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    let radialScale = d3.scaleLinear()
        .domain([0, 10])
        .range([0, 250]);
    let ticks = [2, 4, 6, 8, 10];

    svg.selectAll("circle")
        .data(ticks)
        .join(
            enter => enter.append("circle")
                .attr("cx", width / 2)
                .attr("cy", height / 2)
                .attr("fill", "none")
                .attr("stroke", "gray")
                .attr("r", d => radialScale(d))
        );

    svg.selectAll(".ticklabel")
        .data(ticks)
        .join(
            enter => enter.append("text")
                .attr("class", "ticklabel")
                .attr("x", width / 2 + 5)
                .attr("y", d => height / 2 - radialScale(d))
                .text(d => d.toString())
        );

    function angleToCoordinate(angle: number, value: number){
        let x = Math.cos(angle) * radialScale(value);
        let y = Math.sin(angle) * radialScale(value);
        return {"x": width / 2 + x, "y": height / 2 - y};
    }

    let featureData = features.map((f, i) => {
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        return {
            "name": f,
            "angle": angle,
            "line_coord": angleToCoordinate(angle, 10),
            "label_coord": angleToCoordinate(angle, 10.5)
        };
    });

    // draw axis line
    svg.selectAll("line")
        .data(featureData)
        .join(
            enter => enter.append("line")
                .attr("x1", width / 2)
                .attr("y1", height / 2)
                .attr("x2", d => d.line_coord.x)
                .attr("y2", d => d.line_coord.y)
                .attr("stroke","black")
        );

    // draw axis label
    svg.selectAll(".axislabel")
        .data(featureData)
        .join(
            enter => enter.append("text")
                .attr("x", d => d.label_coord.x)
                .attr("y", d => d.label_coord.y)
                .text(d => d.name)
        );

    // let line = d3.line()
    //     .x(d => d.x)
    //     .y(d => d.y);
    // let colors = ["darkorange", "gray", "navy"];

    // function getPathCoordinates(data_point: {[s: string]: number}){
    //     let coordinates = [];
    //     for (var i = 0; i < features.length; i++){
    //         let ft_name = features[i];
    //         let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
    //         coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
    //     }
    //     return coordinates;
    // }

    // // draw the path element
    // svg.selectAll("path")
    //     .data(data)
    //     .join(
    //         enter: any => enter.append("path")
    //             .datum(d => getPathCoordinates(d))
    //             .attr("d", line)
    //             .attr("stroke-width", 3)
    //             .attr("stroke", (_, i) => colors[i])
    //             .attr("fill", (_, i) => colors[i])
    //             .attr("stroke-opacity", 1)
    //             .attr("opacity", 0.5)
    //     );
}

function drawPositions() {
    const positionsData = champData.average_positions;

    console.log(positionsData);

    drawSpiderChart("positions-graph");
    // const sortedKeys = Object.keys(positionsData).sort((a, b) => {
    //     return rankOrder.indexOf(a) - rankOrder.indexOf(b);
    // });

    // const processedData = positionsData.map((key: string) => ({
    //     name: key,
    //     value: positionsData[key],
    // }));

    //drawBarchartPerElo("positions-graph", processedData, "Avg Position", [0,100], 0);
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
    const winsData = champData.total_games;

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

function drawKDABarCharts() {
    const killsData = champData.average_kills;

    var sortedKeys = Object.keys(killsData).sort((a, b) => {
        return rankOrder.indexOf(a) - rankOrder.indexOf(b);
    });

    var processedData = sortedKeys.map((key: string) => ({
        name: key,
        value: killsData[key],
    }));

    // remove 'all' from processedData
    var allIndex = processedData.findIndex((d) => d.name === "all");
    if (allIndex !== -1) {
        processedData.splice(allIndex, 1);
    }

    drawBarchartPerElo("avg-kills-graph", processedData, "Avg Kills Per Game", [0,d3.max(processedData, (d) => d.value)!], 0);

    const deathsData = champData.average_deaths;

    sortedKeys = Object.keys(deathsData).sort((a, b) => {
        return rankOrder.indexOf(a) - rankOrder.indexOf(b);
    });

    processedData = sortedKeys.map((key: string) => ({
        name: key,
        value: deathsData[key],
    }));

    // remove 'all' from processedData
    allIndex = processedData.findIndex((d) => d.name === "all");
    if (allIndex !== -1) {
        processedData.splice(allIndex, 1);
    }

    drawBarchartPerElo("avg-deaths-graph", processedData, "Avg Deaths Per Game", [0,d3.max(processedData, (d) => d.value)!], 0);

    const assistsData = champData.average_assists;

    sortedKeys = Object.keys(assistsData).sort((a, b) => {
        return rankOrder.indexOf(a) - rankOrder.indexOf(b);
    });

    processedData = sortedKeys.map((key: string) => ({
        name: key,
        value: assistsData[key],
    }));

    // remove 'all' from processedData
    allIndex = processedData.findIndex((d) => d.name === "all");
    if (allIndex !== -1) {
        processedData.splice(allIndex, 1);
    }

    drawBarchartPerElo("avg-assists-graph", processedData, "Avg Assists Per Game", [0,d3.max(processedData, (d) => d.value)!], 0);

    sortedKeys = Object.keys(killsData).sort((a, b) => {
        return rankOrder.indexOf(a) - rankOrder.indexOf(b);
    });

    processedData = sortedKeys.map((key: string) => ({
        name: key,
        value: killsData[key] + assistsData[key] / (deathsData[key] < 1 ? 1 : deathsData[key]),
    }));

    // remove 'all' from processedData
    allIndex = processedData.findIndex((d) => d.name === "all");
    if (allIndex !== -1) {
        processedData.splice(allIndex, 1);
    }

    drawBarchartPerElo("avg-kda-graph", processedData, "Avg KDA Per Game", [0,d3.max(processedData, (d) => d.value)!], 0);
}

// onMounted(() => {
//     drawMatchupGraph();
//     drawWinRatePerElo();
//     drawWinsPerElo();
//     drawKillsBarChart();
// });

</script>

<template>
    <div>
        <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/champstats">Champs</RouterLink>
            <RouterLink to="/champdetail">Champ Details</RouterLink>
            <RouterLink to="/gamedetail">Game Details</RouterLink>
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
                        <p> {{ }}</p>
                        <div class="abilities-container">
                            <div v-for="(ability, index) in champion.getSpells()" :key="index" class="ability">
                                <img :src="`/spell/${ability.image.full}`" alt="Ability Image" class="ability-icon" />
                            </div>
                        </div>
                    </div>
                </div>
                <div id="positions-graph"></div>
                <div>   
                    <div id="matchup-graph"></div>
                    <div id="champion-list"></div>
                </div>
                <div class="charts-container">
                    <div id="winrate-per-elo"></div>
                    <div id="wins-per-elo"></div>
                </div>
                <div class="charts-container">
                    <div id="avg-kills-graph"></div>
                    <div id="avg-deaths-graph"></div>
                </div>
                <div class="charts-container">
                    <div id="avg-assists-graph"></div>
                    <div id="avg-kda-graph"></div>
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

#champion-list {
    margin-top: 10px; 
    color: white;
}
</style>

