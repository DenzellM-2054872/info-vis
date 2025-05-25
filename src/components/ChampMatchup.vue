<template>
  <div id="ChampMatchup">
    <div class="controls">
      <label>
        <input type="radio" value="positive" v-model="wrDeltaSign" /> Good Matchups
      </label>
      <label>
        <input type="radio" value="negative" v-model="wrDeltaSign" /> Bad Matchups
      </label>
      <label>
        <input type="checkbox" v-model="showAllSamples" /> Show all matchups
      </label>
      <label>
        <input type="checkbox" v-model="showAllDifferences" /> Show all winrate deltas
      </label>
    </div>
    <div id="scatter-plot"></div>
  </div>
</template>

<script lang="ts">
import * as d3 from "d3";
import Champions from "@/classes/Champion.ts";
import { defineComponent, onMounted, ref, watch } from "vue";

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
    const wrDeltaSign = ref<"positive" | "negative">("positive");
    const showAllSamples = ref(false);
    const showAllDifferences = ref(false);

    onMounted(() => {
      drawTreemap();
    });

    watch([wrDeltaSign, showAllSamples, showAllDifferences], () => {
      drawTreemap();
    });

    const drawTreemap = () => {
        const svgContainer = d3.select("#scatter-plot");
        svgContainer.selectAll("*").remove();
// Tooltip setup
const tooltip = d3.select("#ChampMatchup")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("background", "black")
  .style("border", "1px solid #ccc")
  .style("padding", "8px")
  .style("border-radius", "6px")
  .style("pointer-events", "none")
  .style("font-size", "14px")
  .style("display", "none")
  .style("z-index", "1000");

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
            const champAverageWR = (props.champStats.wins / props.champStats.games) * 100 || 0;

            const children = [];
            const champTotalGames = props.champStats.games || 0;
            let minGamesThreshold = Math.max(5, champTotalGames * 0.02);

            for (const champ in matchups) {
            const wins = Number(matchups[champ].wins) || 0;
            const games = Number(matchups[champ].games) || 0;
            const wr = (wins / games) * 100 || 0;
            const wrDelta = wr - champAverageWR;
            const weight = Math.abs(wrDelta) * games;

            let thresholdDelta = 2.5;
            if (showAllSamples.value) {
                minGamesThreshold = 0;
            }
            if (showAllDifferences.value) {
                thresholdDelta = 0;
            }

            let deltaCheck = false;
            if (wrDeltaSign.value === "negative") {
                deltaCheck = wrDelta < -thresholdDelta;
            } else if (wrDeltaSign.value === "positive") {
                deltaCheck = wrDelta > thresholdDelta;
            }

            if (games >= minGamesThreshold && deltaCheck) {
                children.push({
                name: champ,
                wr,
                games,
                wrDelta,
                value: weight,
                });
            }
            }

            const maxAbsDelta = d3.max(children, (d) => Math.abs(d.wrDelta)) || 1;

            interface PackNode {
            name: string;
            wr: number;
            games: number;
            wrDelta: number;
            value: number;
            }

            const root = d3
            .hierarchy<unknown>({ children })
            .sum((d: any) => (d as any).value)
            .sort((a, b) => (b.value! - a.value!));

            const pack = d3
            .pack<unknown>()
            .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
            .padding(4);

            pack(root);

            const colorScaleRed = d3
            .scaleLinear<string>()
            .domain([1, 10])
            .range(["#f8d0d0", "#800000"]);

            const colorScaleGreen = d3
            .scaleLinear<string>()
            .domain([1, 10])
            .range(["#d0f8d0", "#005500"]);

            const colorForDelta = (delta: number) => {
            const absDelta = Math.abs(delta);
            if (delta > 0) return colorScaleGreen(absDelta);
            else return colorScaleRed(absDelta);
            };

            const nodes = svg
            .selectAll("g")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("transform", (d: any) => `translate(${d.x},${d.y})`)
            .on("mouseenter", function (event, d: any) {
      d3.select(this).raise(); // Bring to front
      tooltip
        .style("display", "block")
        .html(`
          <strong>${d.data.name}</strong><br>
          Winrate: ${d.data.wr.toFixed(1)}%<br>
          WR Δ: ${d.data.wrDelta.toFixed(1)}<br>
          Games: ${d.data.games}%
        `);
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", `${event.pageX + 15}px`)
        .style("top", `${event.pageY - 20}px`);
    })
    .on("mouseleave", function () {
      tooltip.style("display", "none");
    });

            // Circles 
            nodes
            .append("circle")
            .attr("r", (d: any) => d.r)
            .attr("fill", (d: any) => colorForDelta(d.data.wrDelta))
            .attr("stroke", (d: any) => colorForDelta(d.data.wrDelta))
            .attr("stroke-width", 10);


            // Champion icon inside circle
            nodes
            .append("clipPath")
            .attr("id", (d: any) => `clip-${d.data.name}`)
            .append("circle")
            .attr("r", (d: any) => d.r);

            nodes
            .append("image")
            .attr("xlink:href", (d: any) => Champions.tilePathFromID(d.data.name))
                .attr("x", (d: any) => -d.r)
                .attr("y", (d: any) => -d.r)
                .attr("width", (d: any) => d.r * 2)
                .attr("height", (d: any) => d.r * 2)
            .attr("clip-path", (d: any) => `url(#clip-${d.data.name})`)
            .style("filter", (d: any) => {
                const delta = Math.abs(d.data.wrDelta);
                const ratio = delta / maxAbsDelta;
                let saturation = 0;
                if (ratio >= 0.66) saturation = 1.0;
                else if (ratio >= 0.33) saturation = 0.6;
                else saturation = 0.2;

                return `saturate(${saturation})`;
            });

            const allNodes: {
              group: d3.Selection<SVGGElement, any, any, any>;
              circle: d3.Selection<SVGCircleElement, any, any, any>;
              image: d3.Selection<SVGImageElement, any, any, any>;
              clip: d3.Selection<SVGCircleElement, any, any, any>;
              x: number;
              y: number;
              r: number;
            }[] = [];

            nodes.each(function (d: any) {
            const group = d3.select(this);
            const circle = group.select("circle") as d3.Selection<SVGCircleElement, any, any, any>;
            const image = group.select("image") as d3.Selection<SVGImageElement, any, any, any>;
            const clip = group.select("clipPath").select("circle") as d3.Selection<SVGCircleElement, any, any, any>;

            allNodes.push({
                group,
                circle,
                image,
                clip,
                x: d.x,
                y: d.y,
                r: d.r,
            });
            });

            // Fish-eye lens effect on mouse move
            svg
            .on("mousemove", function (event) {
                const [mouseX, mouseY] = d3.pointer(event);

                allNodes.forEach(({ circle, image, clip, x, y, r }) => {
                const dx = mouseX - x;
                const dy = mouseY - y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                const maxDist = 150;
                const baseScale = 2.4; 
                const falloff = 5000; // Smaller = wider fish-eye area

                let scaleFactor = 1;
                if (distance < maxDist) {
                    scaleFactor = 1 + (baseScale - 1) * Math.exp(-distance * distance / (2 * falloff));
                }

                var newR = Math.min(r * scaleFactor, r * baseScale); // Cap zoom
                if (newR > 80) {
                    if (r < 80) {
                      newR = 80;
                    } else {
                      newR = r;
                    }
                }
                circle.attr("r", newR);
                clip.attr("r", newR);
                image
                    .attr("x", -newR)
                    .attr("y", -newR)
                    .attr("width", newR * 2)
                    .attr("height", newR * 2);
                });
            })
            .on("mouseleave", () => {
                allNodes.forEach(({ circle, image, clip, r }) => {
                circle.attr("r", r);
                clip.attr("r", r);
                image
                    .attr("x", -r)
                    .attr("y", -r)
                    .attr("width", r * 2)
                    .attr("height", r * 2);
                });
            });
        }).catch((err) => {
            console.error("Error loading matchup data:", err);
        });
    };

    return {
        wrDeltaSign,
        showAllSamples,
        showAllDifferences,
    };
    },
});
</script>

<style scoped> 
.controls { margin-bottom: 1rem; display: flex; gap: 1rem; align-items: center; } 
.tooltip {
  transition: opacity 0.2s ease;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.15);
}
</style>