<template>
  <div id="ChampMatchup">
    <div id="scatter-plot"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import * as d3 from "d3";
import Champions from "@/classes/Champion.ts";

interface ChampionMatchup {
  [champ: string]: {
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

export default defineComponent({
  name: "ChampMatchup",
  props: {
    champStats: {
      type: Object as () => ChampionStats,
      required: true,
    },
  },
  setup(props) {
    onMounted(() => {
      drawTreemap();
    });
    const drawTreemap = () => {
        const svgContainer = d3.select("#scatter-plot");
        svgContainer.selectAll("*").remove();

        const containerElement = document.getElementById("ChampMatchup") as HTMLElement;
        const boundingRect = containerElement?.getBoundingClientRect();
        const width = (boundingRect?.width || 800) - 20; 
        const height = 800;

        const margin = { top: 10, right: 10, bottom: 10, left: 10 };

        const svg = svgContainer
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        d3.json("http://localhost:5173/stats/globalWR.json").then((globalData: any) => {
            const matchups: ChampionMatchup = globalData["all"][props.champStats.name];
            const champAverageWR = props.champStats.wins / props.champStats.games * 100 || 0;

            const children = [];
            const champTotalGames = props.champStats.games || 0;
            const minGamesThreshold = Math.max(5, champTotalGames * 0.02);

            for (const champ in matchups) {
                const wins = Number(matchups[champ].wins) || 0;
                const games = Number(matchups[champ].games) || 0;
                const wr = (wins / games) * 100 || 0;
                const wrDelta = wr - champAverageWR;
                const weight = Math.abs(wrDelta) * games;

                if (games >= minGamesThreshold && wrDelta > 2.5) {
                    children.push({
                    name: champ,
                    wr,
                    games,
                    wrDelta,
                    value: weight
                    });
                }
            }

            interface TreemapNode {
                name: string;
                wr: number;
                games: number;
                wrDelta: number;
                value: number;
            }
            const root = d3.hierarchy<{ children: TreemapNode[] } | TreemapNode>(
                { children }
            ).sum((d: any) => (d as TreemapNode).value);

                d3.treemap<{ children: TreemapNode[] } | TreemapNode>()
            .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
            .padding(4)(root)

            const nodes = svg.selectAll("g")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("transform", (d: any) => `translate(${d.x0},${d.y0})`);

            // Border color logic
            const borderColor = (d: any) => {
            const delta = d.data.wrDelta;
            if (Math.abs(delta) < 2.5) return "blue";
            return delta > 0 ? "green" : "red";
            };

            nodes.append("rect")
            .attr("width", (d: any) => d.x1 - d.x0)
            .attr("height", (d: any) => d.y1 - d.y0)
            .attr("fill", "black")
            .attr("stroke", borderColor)
            .attr("stroke-width", 2);

            // Champion icon
            nodes.append("image")
            .attr("xlink:href", (d: any) => Champions.portraitPathFromID(d.data.name))
            .attr("width", (d: any) => d.x1 - d.x0)
            .attr("height", (d: any) => Math.max((d.y1 - d.y0) - 18, 10)) // Leave space for numbers
            .attr("preserveAspectRatio", "xMidYMin");

            nodes.append("text")
                .attr("x", 4)
                .attr("y", (d: any) => d.y1 - d.y0 - 16) // first line higher up
                .attr("font-size", "10px")
                .attr("fill", "white")
                .selectAll("tspan")
                .data((d: any) => [
                    `${(d.data as TreemapNode).games} Games`,
                    `${(d.data as TreemapNode).wr.toFixed(1)}%`
                ])
                .enter()
                .append("tspan")
                .attr("x", 4)
                .attr("dy", (d, i) => i === 0 ? 0 : 12) // 12px down for second line
                .text(d => d);
        }).catch(err => {
            console.error("Error loading matchup data:", err);
        });
    };

    const drawScatterPlot = () => {
        const svgContainer = d3.select("#scatter-plot");
        svgContainer.selectAll("*").remove(); // Clear previous plot

        const margin = { top: 20, right: 30, bottom: 50, left: 60 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = svgContainer
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Append tooltip div
        const tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("color", "black")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "1px solid #ccc")
            .style("padding", "8px")
            .style("border-radius", "4px")
            .style("pointer-events", "none");

        d3.json("http://localhost:5173/stats/globalWR.json")
            .then((globalData: any) => {
            const matchups: ChampionMatchup =
                globalData["all"][props.champStats.name];
            const matchupData: { champ: string; wr: number; games: number; wrDelta : number }[] = [];
            const champAverageWR = props.champStats.wins/props.champStats.games * 100 || 0;
            const champTotalGames = props.champStats.games || 0;

            for (const champ in matchups) {
                const wins = Number(matchups[champ].wins) || 0;
                const games = Number(matchups[champ].games) || 0;
                const wr = (wins / games) * 100 || 0;
                const wrDelta =wr - champAverageWR;
                matchupData.push({ champ, wr, games, wrDelta });
            }
            
            const xDomain = d3.extent(matchupData, (d) => d.games) as [number, number];
            const xMin = Math.min(0, xDomain[0]);
            const xMax = xDomain[1];

            const yMin = d3.min(matchupData, (d) => d.wr) as number;
            const yMax = d3.max(matchupData, (d) => d.wr) as number;

            const x = d3
                .scaleLinear()
                .domain([xMin, xMax])
                .range([0, width]);
            const y = d3
                .scaleLinear()
                .domain([yMin, yMax])
                .range([height, 0]);
            

            // Axes
            const xAxis = svg
                .append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));
            const yAxis = svg.append("g").call(d3.axisLeft(y));

            // Axis labels
            svg.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "middle")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom - 10)
                .text("Games")
                .style("fill", "white")
                .style("font-size", "14px");

            svg.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", -margin.left + 15)
                .text("Winrate (%)")
                .style("fill", "white")
                .style("font-size", "14px");
            
            //Zooming 
            const scatterGroup = svg.append("g").attr("class", "scatter-group");
            scatterGroup
                .selectAll("image")
                .data(matchupData)
                .enter()
                .append("image")
                .attr("x", (d) => x(d.games) - 12)
                .attr("y", (d) => y(d.wr) - 12)
                .attr("width", 24)
                .attr("height", 24)
                .attr("href", (d) => Champions.iconPathFromID(d.champ))
                .on("mouseover", function (event, d) {
                tooltip
                    .style("opacity", 0.9)
                    .html(
                    `${Champions.NamefromID(d.champ)}<br/>WR: ${d.wr.toFixed(
                        1
                    )}%<br/>Games: ${d.games}`
                    );
                })
                .on("mousemove", function (event) {
                tooltip
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY - 28 + "px");
                })
                .on("mouseout", function () {
                tooltip.style("opacity", 0);
                });

            
            const zoomed = (event: any) => {
                const newX = event.transform.rescaleX(x);
                const newY = event.transform.rescaleY(y);

                xAxis.call(d3.axisBottom(newX));
                yAxis.call(d3.axisLeft(newY));

                scatterGroup
                    .selectAll("image")
                    .attr("x", (d: any) => newX(d.games) - 12)
                    .attr("y", (d: any) => newY(d.wr) - 12)
                    .style("display", (d: any) => {
                    const xPos = newX(d.games);
                    const yPos = newY(d.wr);
                    if (xPos < 0 || xPos > width || yPos < 0 || yPos > height) {
                        return "none";  // Icons outside plot 
                    }
                    return null;  // Icons inside plot
                });
            };

            let zoom: any = d3.zoom()
                .scaleExtent([0.5, 10])
                .extent([[0, 0], [width, height]])
                .translateExtent([
                    [x(xMin) - 12, y(yMax) - 12],  // top-left corner limit in pixels
                    [x(xMax) + 12, y(yMin) + 12],  // bottom-right corner limit in pixels
                ])
                .on("zoom", zoomed);

            svg
                .append("rect")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all")
                .lower()
                .call(zoom);
            })
            .catch((error) => {
            console.error("Error loading matchups data:", error);
            });
            
        };
        return {};
    },
});
</script>

//werkt niet 
<style scoped>
.tooltip {
  position: absolute;
  text-align: center;
  color: black;
  padding: 8px;
  font: 12px sans-serif;
  background: black;
  border: 1px solid #ccc;
  border-radius: 4px;
  pointer-events: none;
}
</style>
