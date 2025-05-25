<template>
    <div id="ChampMatchup">
        <div id="matchup-graph" class="matchup-graph">
            <div 
                v-for="(group, index) in groupedData" 
                :key="group.label" 
                class="matchup-box" 
                :style="{ 
                    backgroundColor: group.label.includes('-') ? '#ff6b6b' : '#69b3a2',
                    clipPath: clipPathStyles(index, group.scale, group.label), 
                    height: boxHeight(index, group.scale) + 'px',
                }"
                @click="displayChampionList(group.champions)"
            >
                <h3>{{ group.label }}</h3>
                <p>{{ group.champions.length }} champions</p>
            </div>
        </div>

        <div id="champion-list"></div>
    </div>
</template>

<script lang="ts">
import { ref } from "vue";
import Champions from "@/classes/Champion.ts"; 
import * as d3 from "d3";

interface ChampionMatchup {
    [champ: string] : {
        wins: number;
        losses: number;
        games: number;
    };
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
    name: "ChampMatchup",
    props: {
        champStats: {
            type: Object as () => ChampionStats,
            required: true
        }
    },
    setup(){
        var groupedData = ref<any[]>([]); // Declare groupedData as a reactive reference

        return {
            groupedData,
        };
    },
    methods: {
        drawMatchupGraph() {
            //if (!champion.value) return;
            this.groupedData = [];

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
            
            const champAverageWR = this.champStats.wins / this.champStats.games * 100 || 0;
            const champTotalGames = this.champStats.games || 0;

            //const minGamesThreshold = champTotalGames < 12500 ? Math.max(0, champTotalGames * 0.02) : Math.max(350, champTotalGames * 0.02);
            const minGamesThreshold = Math.max(5, champTotalGames * 0.04);
            const bounds = [
                { label: "-7.5", range: [champAverageWR - 7.5, champAverageWR - 5], scale: 20 },
                { label: "-5", range: [champAverageWR - 5, champAverageWR - 2.5], scale: 10 },
                { label: "-2.5", range: [champAverageWR - 2.5, champAverageWR], scale: 0 },
                { label: "+2.5", range: [champAverageWR, champAverageWR + 2.5], scale: 0 },
                { label: "+5", range: [champAverageWR + 2.5, champAverageWR + 5], scale: 10 },
                { label: "+7.5", range: [champAverageWR + 5, champAverageWR + 7.5], scale: 20 },
            ];

            // Load matchup data
            d3.json("http://localhost:5173/stats/globalWR.json").then((globalData: any) => {
                const matchups: ChampionMatchup[] = globalData["all"][this.champStats.name];
                const matchupData: { champ: string; wr: number; games: number }[] = [];
                // Calculate win rates and filter matchups
                for (const champ in matchups) {
                    const wins = Number(matchups[champ].wins) || 0;
                    const games = Number(matchups[champ].games) || 0;
                    const wr = (wins / games) * 100 || 0;
                    if (Number(games) >= minGamesThreshold) {
                        matchupData.push({ champ, wr, games });
                    }
                }

                // Group data based on bounds
                this.groupedData = bounds.map((bound) => {
                    const filtered = matchupData.filter((d) => d.wr >= bound.range[0] && d.wr < bound.range[1]);
                    return {
                        label: bound.label,
                        champions: filtered,
                        size: Math.abs(bound.range[1] - bound.range[0]),
                        scale: bound.scale,
                    };
                });
                
                
            
                
            }).catch((error) => {
                console.error("Error loading matchup data:", error);
            });
            
        },

        displayChampionList(champions: { champ: string; wr: number; games: number }[]) {
            const listContainer = d3.select("#champion-list");
            listContainer.selectAll("*").remove(); // Clear previous list

            if (champions.length === 0) {
                listContainer.append("p").text("No champions.");
                return;
            }

            const grid = listContainer.append("div")
                .attr("class", "champion-grid");
            const champCount = champions.length;

            champions.forEach((champ) => {
                const realName = Champions.NamefromID(champ.champ);
                const iconUrl = Champions.iconPathFromID(champ.champ); 

                const card = grid.append("div").attr("class", "champion-card");

                card.append("img")
                    .attr("src", iconUrl)
                    .attr("alt", realName);

                const text = card.append("div").attr("class", "champion-card-info");
                text.append("span").attr("class", "champ-name").text(realName);
                text.append("span").attr("class", "champ-stats")
                    .text(`${champ.wr.toFixed(1)}% WR • ${champ.games} games`);
            });
        },

        clipPathStyles(index: number, scale: number, label: number) {
            if (label > 0) {
                return `polygon(0 ${scale}%,100% 0,100% 100%,0 ${100 - scale}%)`;
            } else {
                return `polygon(0 0%,100% ${scale}%,100% ${100 - scale}%,0 100%)`;
            }
        },

        boxHeight(index : number, scale : number) {
            const baseHeight = 200; // Base height for the box
            if (index === 0 || index === 5) return 200;
            const secondHeight = baseHeight * (100 - 20*2) / 100;
            if (index === 1 || index === 4) return secondHeight;
            const thirdHeight = secondHeight * (100 - 10*2) / 100;
            if (index === 2 || index === 3) return thirdHeight;
            return 200;
        }
    },
    mounted(){
        //console.log("ChampMatchup mounted with champStats", this.champStats);
        this.drawMatchupGraph()
    }
}

</script>

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

