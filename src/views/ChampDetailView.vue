<script setup lang="ts">
import { ref, type Ref, watch, onMounted } from "vue";
import Champions from "@/classes/Champion.ts"; 
import * as d3 from "d3";
// filepath: c:\Users\yoshu\Desktop\test\info-vis\src\views\ChampDetailView.vue
//import {ChampDetails} from "../data/ChampDetails.json";
import WinratePerMinute from '@/components/WinratePerMinute.vue';
//import { match } from "assert";

interface ChampDetailsType {
    "average_assists": {[rank: string]: number}
    "average_deaths": {[rank: string]: number}
    "average_kills": {[rank: string]: number}
    "average_positions": {[rank: string]: {[role: string]: number}}
    // "highest_runes_usage:" string[]
    "id": number
    "losses": {[rank: string]: number}
    "name": string
    "positions_played": {[rank: string]: {[role: string]: number}}
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

interface ChampionMatchup {
    [champ: string] : {
        wins: number;
        losses: number;
        games: number;
    };
}

const champName = ref("");
const champion : Ref<Champions | undefined> = ref();
//const searchbar = useTemplateRef<ChampSearch>("champSearch");
var champData: ChampDetailsType = {} as ChampDetailsType;
//drawMatchupGraph();
var champStats: ChampionStats = {} as ChampionStats;
    const groupedData = ref<any[]>([]); // Declare groupedData as a reactive reference

function searchChampion() {
    try {
        champion.value = undefined
        champion.value = new Champions(champName.value);
        d3.json("http://localhost:5173/stats/wbpr.json")
            .then((globalData: any) => {
                champStats = globalData["all"][champName.value];
                // if (!foundStats) {
                //     console.warn("No data found for the selected champion: ", champion.value?.getName());
                //     return;
                // }
                // champStats.value = foundStats; 
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
            drawPositions()
            drawWinratePerMinute()
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
    groupedData.value = [];

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
        const matchups: ChampionMatchup[] = globalData["all"][champName.value];
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
        groupedData.value = bounds.map((bound) => {
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
    
}

function displayChampionList(champions: { champ: string; wr: number; games: number }[]) {
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
}

const clipPathStyles = (index: number, scale: number, label: number) => {
    if (label > 0) {
        return `polygon(0 ${scale}%,100% 0,100% 100%,0 ${100 - scale}%)`;
    } else {
        return `polygon(0 0%,100% ${scale}%,100% ${100 - scale}%,0 100%)`;
    }
};

const boxHeight = (index : number, scale : number) => {
    const baseHeight = 200; // Base height for the box
    if (index === 0 || index === 5) return 200;
    const secondHeight = baseHeight * (100 - 20*2) / 100;
    if (index === 1 || index === 4) return secondHeight;
    const thirdHeight = secondHeight * (100 - 10*2) / 100;
    if (index === 2 || index === 3) return thirdHeight;
    return 200;
};



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

interface RadarChartConfig {
    w: number;
    h: number;
    margin: { top: number; right: number; bottom: number; left: number };
    levels: number;
    maxValue: number;
    labelFactor: number;
    wrapWidth: number;
    opacityArea: number;
    dotRadius: number;
    opacityCircles: number;
    strokeWidth: number;
    roundStrokes: boolean;
    color: d3.ScaleOrdinal<string, string>;
}

interface RadarChartData {
    [key: string]: number;
}

function RadarChart(
    id: string,
    data: RadarChartData[], 
    options?: Partial<RadarChartConfig>
) {
    const cfg: RadarChartConfig = {
        w: 500,
        h: 500,
        margin: { top: 75, right: 75, bottom: 75, left: 75 },
        levels: 3,
        maxValue: 0,
        labelFactor: 1.25,
        wrapWidth: 60,
        opacityArea: 0.35,
        dotRadius: 4,
        opacityCircles: 0.1,
        strokeWidth: 2,
        roundStrokes: false,
        color: d3.scaleOrdinal(d3.schemeCategory10),
    };

    if (options) {
        Object.assign(cfg, options);
    }

    const formattedData = data.map(series => 
        Object.entries(series).map(([axis, value]) => ({ axis, value }))
    );

    // Get all unique axes from all series
    // const allAxis = Array.from(new Set(
    //     formattedData.flatMap(series => series.map(d => d.axis))
    // )).sort(); // Sort for consistent ordering

    console.log("data before", data);

    const allAxis = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'SUPPORT'];
    // sort 'data' by the order of allAxis
    // data.sort((a, b) => {
    //     const aIndex = allAxis.indexOf(Object.keys(a)[0]);
    //     const bIndex = allAxis.indexOf(Object.keys(b)[0]);
    //     return aIndex - bIndex;
    // });
    

    console.log("data after", data);

    //console.log("allAxis", allAxis);

    const maxValue = Math.max(
        cfg.maxValue,
        d3.max(formattedData.flat().map(d => d.value)) || 0
    );

    const total = 5;
    const radius = Math.min(cfg.w / 2, cfg.h / 2);
    const angleSlice = (Math.PI * 2) / total;

    const rScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, radius]);

    d3.select(id).select("svg").remove();

    const svg = d3.select(id)
        .append("svg")
        .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
        .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
        .attr("class", `radar-${id}`);

    const g = svg.append("g")
        .attr("transform", `translate(${cfg.w / 2 + cfg.margin.left}, ${cfg.h / 2 + cfg.margin.top})`);

    // Glow filter
    const filter = g.append('defs').append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur')
        .attr('stdDeviation', '2.5')
        .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Grid circles
    const axisGrid = g.append("g").attr("class", "axisWrapper");
    
    axisGrid.selectAll(".gridCircle")
        .data(d3.range(1, cfg.levels + 1).reverse())
        .enter().append("circle")
        .attr("class", "gridCircle")
        .attr("r", d => (radius / cfg.levels) * d)
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)
        .style("filter", "url(#glow)");

    // Level labels
    const format = d3.format('.01f');
    axisGrid.selectAll(".axisLabel")
        .data(d3.range(1, cfg.levels + 1).reverse())
        .enter().append("text")
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", d => -d * (radius / cfg.levels))
        .attr("dy", "0.0em")
        .style("font-size", "20px")
        .attr("fill", "#ffffff")
        .text(d => format((maxValue * d) / cfg.levels));

    // Axes
    const axis = axisGrid.selectAll(".axis")
        .data(allAxis)  // Now using our sorted unique axes
        .enter()
        .append("g")
        .attr("class", "axis");

    //console.log("axis", axis);

    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y2", (d, i) => rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
        .style("stroke", "#d0d0d0")
        .style("stroke-width", "2px");

    // Axis labels
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("fill", "#ffffff")
        .attr("x", (d, i) => rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y", (d, i) => rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
        .text(d => d)
        .call(wrap as (selection: d3.Selection<SVGTextElement, string, SVGGElement, unknown>, args_0: number) => void, cfg.wrapWidth);

    // Radar line
    const radarLine = d3.radialLine<{ axis: string; value: number }>()
        .radius(d => rScale(d.value))
        .angle((d, i) => {
            const index = allAxis.indexOf(d.axis);
            return index * angleSlice;
        })
        .curve(cfg.roundStrokes ? d3.curveCardinalClosed : d3.curveLinearClosed);

    // Draw blobs
    const blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");

    // loop over data points
    // for (let i = 0; i < formattedData[0].length; i++) {
    //     const d = formattedData[0][i].value;
    //     console.log("d", d);
    //     svg.append("line")
    //         .attr("class", "radarStroke")
    //         .attr("x1", cfg.w/2 + cfg.margin.left)
    //         .attr("y1", cfg.h/2 + cfg.margin.top)
    //         .attr("x2", rScale(d) * Math.cos(angleSlice * i - Math.PI / 2))
    //         .attr("y2", rScale(d) * Math.sin(angleSlice * i - Math.PI / 2))
    //         .style("stroke-width", `${cfg.strokeWidth}px`)
    //         .style("stroke", cfg.color(i.toString()))
    //         .style("fill", "none")
    //         .style("filter", "url(#glow)");
    // }

    // Areas

    
    blobWrapper.append("path")
        .attr("class", "radarArea")
        .attr("d", d => radarLine(Object.entries(d).map(([axis, value]) => ({ axis, value }))))
        .style("fill", (d, i) => cfg.color(i.toString()))
        .style("fill-opacity", cfg.opacityArea)
        .on("mouseover", function() {
            d3.selectAll(".radarArea").style("fill-opacity", 0.1);
            d3.select(this).style("fill-opacity", 0.7);
        })
        .on("mouseout", function() {
            d3.selectAll(".radarArea").style("fill-opacity", cfg.opacityArea);
        });

    // Strokes
    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", d => radarLine(Object.entries(d).map(([axis, value]) => ({ axis, value }))))
        .style("stroke-width", `${cfg.strokeWidth}px`)
        .style("stroke", (d, i) => cfg.color(i.toString()))
        .style("fill", "none")
        .style("filter", "url(#glow)");

    // Circles
    blobWrapper.selectAll(".radarCircle")
        .data(d => Object.values(d))
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", (d, i) => rScale(d) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("cy", (d, i) => rScale(d) * Math.sin(angleSlice * i - Math.PI / 2))
        .style("fill", (d, i, nodes) => {
            const data = d3.select(nodes[i]).datum() as { [key: string]: number };
            return cfg.color(Object.values(data).indexOf(d).toString());
        })
        .style("fill-opacity", 0.8);

    // Tooltip circles
    const blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");

    const tooltip = g.append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);

    blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(d => Object.values(d))
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius * 1.5)
        .attr("cx", (d, i) => rScale(d) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("cy", (d, i) => rScale(d) * Math.sin(angleSlice * i - Math.PI / 2))
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function(event, d) {
            const x = parseFloat(d3.select(this).attr("cx")) - 10;
            const y = parseFloat(d3.select(this).attr("cy")) - 10;
            
            tooltip.attr("x", x)
                .attr("y", y)
                .text(format(d))
                .transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        });

    // Text wrapping
    function wrap(text: d3.Selection<SVGTextElement, unknown, SVGGElement, unknown>, width: number) {
        text.each(function() {
            const textNode = d3.select(this);
            const words = textNode.text().split(/\s+/).reverse();
            let line: string[] = [];
            let lineNumber = 0;
            const lineHeight = 1.4;
            const x = textNode.attr("x");
            const y = textNode.attr("y");
            const dy = parseFloat(textNode.attr("dy")) || 0;
            
            let tspan = textNode.text(null)
                .append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", `${dy}em`);

            let word: string | undefined;
            while ((word = words.pop())) {
                line.push(word);
                tspan.text(line.join(' '));
                
                if (tspan.node() && tspan.node()!.getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(' '));
                    line = [word];
                    tspan = textNode.append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", `${++lineNumber * lineHeight + dy}em`)
                        .text(word);
                }
            }
        });
    }
}

function drawPositions() {
    const positionsData = champData.average_positions;

    //console.log(positionsData);

    var allRanksPositions = [];
    for (const key in positionsData) {
        if (key !== "all") {
            var roles: {[role: string]: number} = {};
            roles["TOP"] = positionsData[key]["TOP"] || 0;
            roles["JUNGLE"] = positionsData[key]["JUNGLE"] || 0;
            roles["MIDDLE"] = positionsData[key]["MIDDLE"] || 0;
            roles["BOTTOM"] = positionsData[key]["BOTTOM"] || 0;
            roles["SUPPORT"] = positionsData[key]["UTILITY"] || 0;
            delete roles["Invalid"];

            allRanksPositions.push(roles);
            //allRanksPositions.push(positionsData[key]);
        }
    }

    //console.log(allRanksPositions);

    const myData = {
        "TOP": 0.1,
        "JUNGLE": 0.2,
        "MIDDLE": 0.1,
        "BOTTOM": 0.5,
        "SUPPORT": 0.1
    };

    const chartData = [myData]; // Wrap in array to support multiple data series

    // var maxValue = 0;
    // for (const key in positionsData["all"]) {
    //     if (positionsData["all"][key] > maxValue) {
    //         maxValue = positionsData["all"][key];
    //     }
    // }

    // Create the charts
    RadarChart("#positions-graph", allRanksPositions, {
        maxValue: 1, // Set appropriate max value for your scale
        wrapWidth: 80,
        labelFactor: 1.2
    });
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

    drawBarchartPerElo("wins-per-elo", processedData, "Total Games", [0,d3.max(processedData, (d) => d.value)!], winsData["all"]);
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

    drawBarchartPerElo("avg-kills-graph", processedData, "Avg Kills Per Game", [0,d3.max(processedData, (d) => d.value)!], killsData["all"]);

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

    drawBarchartPerElo("avg-deaths-graph", processedData, "Avg Deaths Per Game", [0,d3.max(processedData, (d) => d.value)!], deathsData["all"]);

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

    drawBarchartPerElo("avg-assists-graph", processedData, "Avg Assists Per Game", [0,d3.max(processedData, (d) => d.value)!], assistsData["all"]);

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

    const averageKDA = killsData["all"] + assistsData["all"] / (deathsData["all"] < 1 ? 1 : deathsData["all"]);

    drawBarchartPerElo("avg-kda-graph", processedData, "Avg KDA Per Game", [0,d3.max(processedData, (d) => d.value)!], averageKDA);
}

function drawWinratePerMinute() {
    const minuteData = champData.winrate_at_times;
    console.log(minuteData);

    var processedData = [];
    for (const key in minuteData) {
        processedData.push({
            name: key,
            value: minuteData[key] * 100,
        });
    }

    const avgWinrate = champData.wins["all"] / champData.total_games["all"] * 100;

    drawBarchartPerElo("winrate-per-minute", processedData, "Win Rate Per Minute", [0,100], avgWinrate);
}

// onMounted(() => {
//     drawMatchupGraph();
//     drawWinRatePerElo();
//     drawWinsPerElo();
//     drawKillsBarChart();
// });



</script>

<template>
    <div class="content">
        <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/champstats">Champs</RouterLink>
            <RouterLink to="/champdetail">Champ Details</RouterLink>
            <RouterLink to="/gamedetail">Game Details</RouterLink>
        </nav>
        <div class="search-container">
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
                <div id="winrate-per-minute"></div>
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

