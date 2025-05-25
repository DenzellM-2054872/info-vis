<template>
    <div id="EloBarcharts">
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
</template>

<script lang="ts">
import * as d3 from "d3";

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
    "winrate_at_times": {[minute: string]: number}
    "wins": {[rank: string]: number}
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

export default{
    name: "EloBarcharts",
    props: {
        champData: {
            type: Object as () => ChampDetailsType,
            required: true
        }
    },
    setup(){
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
                "Unranked": "#394f3d",
                "IRONI": "#6936d2",
                "IRONII": "#6936d2",
                "IRONIII": "#6936d2",
                "IRONIV": "#6936d2",
                "BRONZEI": "#596627",
                "BRONZEII": "#596627",
                "BRONZEIII": "#596627",
                "BRONZEIV": "#596627",
                "SILVERI": "#9e2e9e",
                "SILVERII": "#9e2e9e",
                "SILVERIII": "#9e2e9e",
                "SILVERIV": "#9e2e9e",
                "GOLDI": "#a23c29",
                "GOLDII": "#a23c29",
                "GOLDIII": "#a23c29",
                "GOLDIV": "#a23c29",
                "PLATINUMI": "#4a3788",
                "PLATINUMII": "#4a3788",
                "PLATINUMIII": "#4a3788",
                "PLATINUMIV": "#4a3788",
                "EMERALDI": "#4b2630",
                "EMERALDII": "#4b2630",
                "EMERALDIII": "#4b2630",
                "EMERALDIV": "#4b2630",
                "DIAMONDI": "#963663",
                "DIAMONDII": "#963663",
                "DIAMONDIII": "#963663",
                "DIAMONDIV": "#963663",
                "MASTERI": "#4f5678",
                "GRANDMASTERI": "#4f5678",
                "CHALLENGERI": "#4f5678",
        };

        return{
            rankOrder,
            colorMapping
        }
    },
    methods: {
        drawBarchartPerElo(divId: string, processedData: any[], y_label: string, y_scale: number[], lineValue: number) {
            const svgContainer = d3.select("#" + divId);
            svgContainer.selectAll("*").remove();

            const margin = { top: 20, right: 30, bottom: 70, left: 50 };
            const width = 800 - margin.left - margin.right;
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
                .attr("fill", (d) => this.colorMapping[d.name] || "#69b3a2");

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
        },

        drawStackedBarchart(divId: string, processedData: any[], y_label: string, subcategories: string[]) {
            const margin = { top: 20, right: 30, bottom: 70, left: 50 };
            const width = 800 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            const svg = d3.select("#" + divId)
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
            
            const x = d3.scaleBand()
                .domain(processedData.map(d => d.name))
                .range([0, width])
                .padding(0.2);

            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "rotate(-45)")
                .style("text-anchor", "end");

            const y = d3.scaleLinear()
                .domain([0, d3.max(processedData, d => d.kills + d.assists)!])
                .range([height, 0]);

            svg.append("g")
                .call(d3.axisLeft(y));

            const color = d3.scaleOrdinal()
                .domain(subcategories)
                .range(['#e41a1c', '#377eb8']);

            const stackedData = d3.stack()
                .keys(subcategories)(processedData);

            svg.append("g")
                .selectAll("g")
                .data(stackedData)
                .enter().append("g")
                    .attr("fill", d => color(d.key) as string)
                .selectAll("rect")
                .data(d => d)
                .enter().append("rect")
                    .attr("x", d => x(String(d.data.name))!)
                    .attr("y", d => y(d[1]))
                    .attr("height", d => y(d[0]) - y(d[1]))
                    .attr("width", x.bandwidth());

        },

        RadarChart(
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

            const allAxis = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'SUPPORT'];

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
        },

        drawPositions() {
            const positionsData = this.champData.average_positions;

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
                }
            }

            const myData = {
                "TOP": 0.1,
                "JUNGLE": 0.2,
                "MIDDLE": 0.1,
                "BOTTOM": 0.5,
                "SUPPORT": 0.1
            };

            const chartData = [myData]; // Wrap in array to support multiple data series

            // Create the charts
            this.RadarChart("#positions-graph", allRanksPositions, {
                maxValue: 1, // Set appropriate max value for your scale
                wrapWidth: 80,
                labelFactor: 1.2
            });
        },

        drawWinRatePerElo() {
            const winsData = this.champData.wins;
            const gameCountData = this.champData.total_games;

            const sortedKeys = Object.keys(winsData).sort((a, b) => {
                return this.rankOrder.indexOf(a) - this.rankOrder.indexOf(b);
            });

            const processedData = sortedKeys.map((key: string) => ({
                name: key,
                value: winsData[key] / gameCountData[key] * 100, // Calculate win rate percentage
            }));

            this.drawBarchartPerElo("winrate-per-elo", processedData, "Win Rate (%)", [0,100], winsData["all"] / gameCountData["all"] * 100);
        },

        drawWinsPerElo() {
            const winsData = this.champData.total_games;

            const sortedKeys = Object.keys(winsData).sort((a, b) => {
                return this.rankOrder.indexOf(a) - this.rankOrder.indexOf(b);
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

            this.drawBarchartPerElo("wins-per-elo", processedData, "Total Games", [0,d3.max(processedData, (d) => d.value)!], winsData["all"]);
        },

        drawKDABarCharts() {
            const killsData = this.champData.average_kills;
            const assistsData = this.champData.average_assists;

            var sortedKeys = Object.keys(killsData).sort((a, b) => {
                return this.rankOrder.indexOf(a) - this.rankOrder.indexOf(b);
            });

            var processedData = sortedKeys.map((key: string) => ({
                name: key,
                kills: killsData[key],
                assists: assistsData[key],
            }));

            // remove 'all' from processedData
            var allIndex = processedData.findIndex((d) => d.name === "all");
            if (allIndex !== -1) {
                processedData.splice(allIndex, 1);
            }

            // insert into processedData at index 1
            processedData.splice(1, 0, {name: "1", kills: 0, assists: 0});
            processedData.splice(6, 0, {name: "2", kills: 0, assists: 0});
            processedData.splice(11, 0, {name: "3", kills: 0, assists: 0});
            processedData.splice(16, 0, {name: "4", kills: 0, assists: 0});
            processedData.splice(21, 0, {name: "5", kills: 0, assists: 0});
            processedData.splice(26, 0, {name: "6", kills: 0, assists: 0});
            processedData.splice(31, 0, {name: "7", kills: 0, assists: 0});
            processedData.splice(36, 0, {name: "8", kills: 0, assists: 0});

            //this.drawBarchartPerElo("avg-kills-graph", processedData, "Avg Kills Per Game", [0,d3.max(processedData, (d) => d.value)!], killsData["all"]);
            this.drawStackedBarchart("avg-kills-graph", processedData, "Avg Kills Per Game", ["kills", "assists"]);

            const deathsData = this.champData.average_deaths;

            sortedKeys = Object.keys(deathsData).sort((a, b) => {
                return this.rankOrder.indexOf(a) - this.rankOrder.indexOf(b);
            });

            var processedDeathsData = sortedKeys.map((key: string) => ({
                name: key,
                value: deathsData[key],
            }));

            // remove 'all' from processedData
            allIndex = processedDeathsData.findIndex((d) => d.name === "all");
            if (allIndex !== -1) {
                processedDeathsData.splice(allIndex, 1);
            }

            this.drawBarchartPerElo("avg-deaths-graph", processedDeathsData, "Avg Deaths Per Game", [0,d3.max(processedDeathsData, (d) => d.value)!], deathsData["all"]);

            //const assistsData = this.champData.average_assists;

            // sortedKeys = Object.keys(assistsData).sort((a, b) => {
            //     return this.rankOrder.indexOf(a) - this.rankOrder.indexOf(b);
            // });

            // processedData = sortedKeys.map((key: string) => ({
            //     name: key,
            //     value: assistsData[key],
            // }));

            // // remove 'all' from processedData
            // allIndex = processedData.findIndex((d) => d.name === "all");
            // if (allIndex !== -1) {
            //     processedData.splice(allIndex, 1);
            // }

            // this.drawBarchartPerElo("avg-assists-graph", processedData, "Avg Assists Per Game", [0,d3.max(processedData, (d) => d.value)!], assistsData["all"]);

            sortedKeys = Object.keys(killsData).sort((a, b) => {
                return this.rankOrder.indexOf(a) - this.rankOrder.indexOf(b);
            });

            var processedKDAData = sortedKeys.map((key: string) => ({
                name: key,
                value: killsData[key] + assistsData[key] / (deathsData[key] < 1 ? 1 : deathsData[key]),
            }));

            // remove 'all' from processedData
            allIndex = processedKDAData.findIndex((d) => d.name === "all");
            if (allIndex !== -1) {
                processedKDAData.splice(allIndex, 1);
            }

            const averageKDA = killsData["all"] + assistsData["all"] / (deathsData["all"] < 1 ? 1 : deathsData["all"]);

            this.drawBarchartPerElo("avg-kda-graph", processedKDAData, "Avg KDA Per Game", [0,d3.max(processedKDAData, (d) => d.value)!], averageKDA);
        },

        drawWinratePerMinute() {
            var minuteData = this.champData.winrate_at_times;
            //console.log("minuteData", minuteData);

            var minKey = Math.min(...Object.keys(minuteData).map(Number));
            var maxKey = Math.max(...Object.keys(minuteData).map(Number));
            //console.log("minKey", minKey, "maxKey", maxKey);

            for (let i = minKey; i <= maxKey; i+=2.5) {
                var i_string = i.toLocaleString(undefined, { maximumFractionDigits: 1, minimumFractionDigits: 1 });
                // console.log("i", i_string);
                if (!(i_string in minuteData)) {
                    minuteData[i_string] = 0; // Fill missing minutes with 0
                }
            }
            //console.log("minuteData after filling", minuteData);

            // Sort minuteData by keys
            const sortedKeys = Object.keys(minuteData).sort((a, b) => parseFloat(a) - parseFloat(b));
            var sortedMinuteData: {[minute: string]: number} = {};
            for (let i = 0; i < sortedKeys.length; i++) {
                const key = sortedKeys[i];
                sortedMinuteData[key] = minuteData[key] || 0; // Ensure all keys have a value
            }

            var processedData = [];
            for (const key in sortedMinuteData) {
                //console.log("key", key, "value", sortedMinuteData[key]);
                processedData.push({
                    name: key,
                    value: sortedMinuteData[key] * 100,
                });
            }

            //console.log("processedData", processedData);

            const avgWinrate = this.champData.wins["all"] / this.champData.total_games["all"] * 100;

            this.drawBarchartPerElo("winrate-per-minute", processedData, "Win Rate Per Minute", [0,100], avgWinrate);
        }
    },
    mounted(){
        //console.log("EloBarcharts mounted with champData", this.champData);
        this.drawPositions()
        this.drawWinratePerMinute()
        this.drawWinRatePerElo()
        this.drawWinsPerElo()
        this.drawKDABarCharts()
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

