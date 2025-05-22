
<template>
    <div id="ChampScatter"></div>
</template>

<script  lang="js">

import * as d3 from "d3" ;
import Champions from "@/classes/Champion.ts";
import { computed, ref} from 'vue'

export default{
    name: "ChampScatter",
    setup(){
        const displayIcons = ref(false)
        const colours = ref({
            "Controller": "#4daf4a",
            "Fighter": "#984ea3",
            "Mage": "#377eb8",
            "Marksman": "#ff7f00",
            "Tank": "#a65628",
            "Specialist": "#ffff33",
            "Slayer": "#e41a1c",
        })
        let data = undefined
        let selected_data = undefined
        let data_mastery = undefined

        const visible = ref({
            "Controller": true,
            "Fighter": true,
            "Mage": true,
            "Marksman": true,
            "Tank": true,
            "Specialist": true,
            "Slayer": true,
        })
        const margin = {top: 10, right: 30, bottom: 30, left: 60}
        const width = 460 - margin.left - margin.right
        const height = 400 - margin.top - margin.bottom
        let x = d3.scaleLinear()
                        .domain([42, 58])
                        .range([ 0, width ])
        let newX = x

        let y = d3.scaleLinear()
                    .domain([0, 60000])
                    .range([ height, 0]);
        let newY = y

        let totalGames = 0
        let totalBanrate = 0
        let yAxis = undefined
        let yLabel = undefined
        let xAxis = undefined
        let xLabel = undefined
        let yLine = undefined
        let axisValue = "games"
        let rank = "all"
        let name = ""
        return{
            data,
            selected_data,
            data_mastery,
            displayIcons,
            colours,
            visible,
            totalGames,
            totalBanrate,
            x,
            newX,
            y,
            newY,
            yAxis,
            yLabel,
            xAxis,
            xLabel,
            yLine,
            axisValue,
            margin,
            width,
            height,
            rank,
            name
        }
    },
    methods: {

        mostGames(){
            return Object.values(this.selected_data).reduce((accumulator, point) =>  {return Math.max(Number(accumulator), Number(point.games))}, 0)
        },
        highestWinDelta(){
            return Object.values(this.selected_data).reduce((accumulator, point) =>  {return Math.max(Number(accumulator), Math.abs(50 - Number(point.WR)))}, 0)
        },
        highestBanrate(){
            let totalGames = this.totalGames
            return Object.values(this.selected_data).reduce((accumulator, point) =>  {return Math.max(Number(accumulator), ((Number(point.effectiveBans) / totalGames)  * 100))}, 0)
        },
        setDisplay(axisValue){
            this.axisValue = axisValue
            if(axisValue == "games"){
                this.yLabel.text("Games")
                if(this.rank == 'GRANDMASTER'){
                    this.y = d3.scaleLinear()
                        .domain([0, Math.ceil(this.mostGames() / 500) * 500])
                        .range([this.height, 0]);
                }else{
                    this.y = d3.scaleLinear()
                        .domain([0, Math.ceil(this.mostGames() / 1000) * 1000])
                        .range([this.height, 0]);
                }
                this.yLine
                    .attr("y1", this.y(this.totalGames / Object.values(this.selected_data).length * 10))
                    .attr("y2", this.y(this.totalGames /Object.values(this.selected_data).length * 10))
            }else if(axisValue == "banrate"){
                this.yLabel.text("Banrate (%)")

                this.y = d3.scaleLinear()
                    .domain([0, Math.ceil(this.highestBanrate() / 5) * 5])
                    .range([this.height, 0]);
                this.yLine
                    .attr("y1", this.y(this.totalBanrate / Object.values(this.selected_data).length))
                    .attr("y2", this.y(this.totalBanrate /Object.values(this.selected_data).length))
            }

            this.yAxis.transition()
            .duration(200).call(d3.axisLeft(this.y));
            this.newY = this.y
            this.updatePosition(d3.select("#ChampScatter"), 25)
            
        },
        setDataRank(rank){
            if(!String(rank).endsWith('+')){
                this.selected_data = this.data[rank];
                return
            }
            this.selected_data = structuredClone(this.data["GRANDMASTER"]);

            for(let r of ["MASTER", "DIAMOND", "EMERALD", "PLATINUM"]){
                for(let champ in this.data[r]){
                this.selected_data[champ]['wins'] += this.data[r][champ]['wins']
                this.selected_data[champ]['losses'] += this.data[r][champ]['losses']
                this.selected_data[champ]['games'] += this.data[r][champ]['games']
                this.selected_data[champ]['bans'] += this.data[r][champ]['bans']
                this.selected_data[champ]['effectiveBans'] += this.data[r][champ]['effectiveBans']
                }
                if(rank == `${r}+`) break;
            }

            for(let champ in  this.selected_data){
                this.selected_data[champ]['WR'] = (this.selected_data[champ]['wins'] / this.selected_data[champ]['games']) * 100
            }
        },        
        setDataMastery(mastery){
            this.selected_data = {}
            mastery = Number(mastery)
            
            for(let m in this.data_mastery){
                m = Number(m)
                
                if(m == -100) continue;
                switch (mastery) {
                    case 0:
                        if(!(m >= 0 && m < 21600)) continue;
                        break;
                    case 1:
                        if(!(m >= 12600 && m < 75600)) continue;
                        break;
                    case 2:
                        if(!(m >= 75600 && m < 240600)) continue;
                        break;
                    case 3:
                        if(!(m >= 240600)) continue;
                        break;
                    default:
                        continue;
                }

                for(let champ in this.data_mastery[m]){
                    if(!this.selected_data[champ]){
                        this.selected_data[champ] = {}
                        this.selected_data[champ]['wins'] = 0
                        this.selected_data[champ]['losses'] = 0
                        this.selected_data[champ]['games'] = 0
                        this.selected_data[champ]['name'] = champ
                        this.selected_data[champ]['class'] = Champions.ClassesfromID(champ)[0]
                    }
                    this.selected_data[champ]['wins'] += this.data_mastery[m][champ]['wins']
                    this.selected_data[champ]['losses'] += this.data_mastery[m][champ]['losses']
                    this.selected_data[champ]['games'] += this.data_mastery[m][champ]['games']
                }
            }

            for(let champ in  this.selected_data){
                this.selected_data[champ]['WR'] = (this.selected_data[champ]['wins'] / this.selected_data[champ]['games']) * 100
            }
        },
        setMastery(mastery){
            this.setDisplay('games')
            this.setDataMastery(mastery)
            this.totalGames = Object.values(this.selected_data).reduce((accumulator, point) =>  {return Number(accumulator) + Number(point.games)}, 0) / 10
            
            this.x = d3.scaleLinear()
            .domain([50 + Math.ceil(this.highestWinDelta()), 50 - Math.ceil(this.highestWinDelta())])
            .range([this.height, 0]);
            this.xAxis.transition()
            .duration(200).call(d3.axisBottom(this.x));
            
            this.setDisplay(this.axisValue)
            console.log(this.selected_data)
            this.renderData(this.selected_data)
        },
        setRank(rank){
            this.rank = rank
            this.setDataRank(rank)
            this.totalGames = Object.values(this.selected_data).reduce((accumulator, point) =>  {return Number(accumulator) + Number(point.games)}, 0) / 10

            this.x = d3.scaleLinear()
                        .domain([50 + Math.ceil(this.highestWinDelta()), 50 - Math.ceil(this.highestWinDelta())])
                        .range([this.height, 0]);
            this.xAxis.transition()
                        .duration(200).call(d3.axisBottom(this.x));
            this.newX = this.x

            this.renderData()
        },
        setIcons(displayIcons){
            this.hide(d3.select("#ChampScatter"))
            this.displayIcons = displayIcons
            this.show(d3.select("#ChampScatter"))
        },
        updatePosition(nodes, size){
            let speed = 200
                nodes.selectAll("image").transition()
                    .duration(speed)
                    .attr("x", (d) => { return this.newX(d.WR) - size / 2; } )
                    .attr("y", (d) => {
                        if(this.axisValue == "games") {return this.newY(d.games) - size / 2}
                        if(this.axisValue == "banrate") {return this.newY((Math.round((d.effectiveBans / this.totalGames )  * 10000)) / 100) - size / 2}
                    })

                nodes.selectAll("rect").filter((d) => d)
                    .transition()
                    .duration(speed)
                    .attr("x",  (d) => { return this.newX(d.WR) - size / 2; } )
                    .attr("y",  (d) => {
                        if(this.axisValue == "games") {return this.newY(d.games) - size / 2}
                        if(this.axisValue == "banrate") {return this.newY((Math.round((d.effectiveBans / this.totalGames)  * 10000)) / 100) - size / 2}
                    })

                nodes.selectAll("circle")
                    .transition()
                    .duration(speed)
                    .attr("cx", (d) => { return this.newX(d.WR); } )
                    .attr("cy", (d) => { 
                        if(this.axisValue == "games") return this.newY(d.games)
                        if(this.axisValue == "banrate") return this.newY((Math.round((d.effectiveBans /  this.totalGames)  * 10000)) / 100)
                    })


        },
        lowLight(nodes){ 
            let size = 20
            if(this.displayIcons){
                nodes.selectAll("image").transition()
                    .duration(200)
                    .style("opacity", 0.33)
                    .style("display", "block")
                    .attr("width", size)
                    .attr("height", size)
                    .attr("x", (d) => { return this.newX(d.WR) - size / 2; } )
                    .attr("y", (d) => {
                        if(this.axisValue == "games") {return this.newY(d.games) - size / 2}
                        if(this.axisValue == "banrate") {return this.newY((Math.round((d.effectiveBans / totalGames )  * 10000)) / 100) - size / 2}
                    })

                nodes.selectAll("rect").filter((d) => { return d; })
                    .transition()
                    .duration(200)
                    .style("stroke", "lightgrey")
                    .style("opacity", 0.33)
                    .style("display", "block")
                    .attr("width", size)
                    .attr("height", size)
                    .attr("x", (d) => { return this.newX(d.WR) - size / 2; } )
                    .attr("y", (d) => {
                        if(this.axisValue == "games") {return this.newY(d.games) - size / 2}
                        if(this.axisValue == "banrate") {return this.newY((Math.round((d.effectiveBans / totalGames )  * 10000)) / 100) - size / 2}
                    })

            }else{
                nodes.selectAll("circle").transition()
                .duration(200)
                .style("fill", "lightgrey")
                .style("opacity", 0.33)
                .style("display", "block")
                .attr("r", 5)
                
            }
        },
        show(nodes){
            let size = 25
            if(this.displayIcons){
                nodes.selectAll("image")
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("display", "block")
                    .attr("width", size)
                    .attr("height", size)
                    .attr("x", (d) => { return this.newX(d.WR) - size / 2; } )
                    .attr("y", (d) => {
                        if(this.axisValue == "games") {return this.newY(d.games) - size / 2}
                        if(this.axisValue == "banrate") {return this.newY((Math.round((d.effectiveBans / totalGames )  * 10000)) / 100) - size / 2}
                    })

                nodes.selectAll("rect").filter((d) => { return d; })
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("display", "block")
                    .attr("width", size)
                    .attr("height", size)
                    .attr("fill", "none")
                    .style("stroke", (d) => this.colours[d.class])
                    .attr("x", (d) => { return this.newX(d.WR) - size / 2; } )
                    .attr("y", (d) => {
                        if(this.axisValue == "games") {return this.newY(d.games) - size / 2}
                        if(this.axisValue == "banrate") {return this.newY((Math.round((d.effectiveBans / totalGames )  * 10000)) / 100) - size / 2}
                    })

            }else{
                nodes.selectAll("circle")
                    .transition()
                    .duration(200)
                    .attr("r", 5)
                    .style("opacity", 1)
                    .style("display", "block")
                    .style("stroke", "black")
                    .style("fill", (d) => this.colours[d.class])
            }
        },
        highlight(nodes){
            nodes.raise()
            let size = 30
            if(this.displayIcons){
                nodes.selectAll("image").transition()
                    .duration(200)
                    .style("opacity", 1)
                    .attr("width", size)
                    .attr("height", size)
                    .attr("x", (d) => { return this.newX(d.WR) - size / 2; } )
                    .attr("y", (d) => {
                        if(this.axisValue == "games") {return this.newY(d.games) - size / 2}
                        if(this.axisValue == "banrate") {return this.newY((Math.round((d.effectiveBans / totalGames )  * 10000)) / 100) - size / 2}
                    })

                nodes.selectAll("rect").filter((d) => { return d; })
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("display", "block")
                    .attr("width", size)
                    .attr("height", size)
                    .style("stroke", (d) => this.colours[d.class])
                    .attr("x", (d) => { return this.newX(d.WR) - size / 2; } )
                    .attr("y", (d) => {
                        if(this.axisValue == "games") {return this.newY(d.games) - size / 2}
                        if(this.axisValue == "banrate") {return this.newY((Math.round((d.effectiveBans / totalGames )  * 10000)) / 100) - size / 2}
                    })
            }else{
                nodes.selectAll("circle").transition()
                    .duration(200)
                    .style("opacity", 1)
                    .attr("r", 6)
                    .style("fill", (d) => this.colours[d.class])
            }

        },
        highlightName(name){
            this.name = name
            this.lowLight(d3.select("#ChampScatter"))
            
            let nodes = d3.select("#ChampScatter").selectAll("g").filter(
                (d) => { return d && d.name && d.name.toLowerCase().includes(name.toLowerCase()) && this.visible[Champions.ClassesfromID(d.name)[0]]; 

                })
            nodes.raise()
            this.show(nodes)
        },
        hide(nodes){
            if(this.displayIcons){
                nodes.selectAll("image").transition()
                    .duration(200)
                    .style("display", "none")

                nodes.selectAll("rect").filter((d) => { return d; })
                    .transition()
                    .duration(200)
                    .style("display", "none")
            }else{
                nodes.selectAll("circle").transition()
                    .duration(200)
                    .attr("r", 5)
                    .style("display", "none")
            }
        },
        renderData(){          
            d3.select("#ChampScatter").select(`.dataWrapper`).selectAll("*").remove()
            
            let groups = d3.select("#ChampScatter").select(`.dataWrapper`)
                .selectAll("dot")
                .data(Object.values(Object(this.selected_data)))
                .enter()
                .append('g')
                .attr("class", function (d) {return Champions.ClassesfromID(d.name)[0]; })         

            groups.append('image')
                .attr("href", (d) => {return Champions.iconPathFromID(d.name)})
                .style("display", "none")
                .on("mouseover", this.mouseover )
                .on("mousemove", this.mousemove )
                .on("mouseleave", this.mouseleave )

            groups.append('rect')
                .style("display", "none")

            groups.append("circle")
                .attr("cx", (d) => { return this.newX(d.WR); } )
                .attr("cy", (d) => { 
                    if(this.axisValue == "games") return this.newY(d.games)
                    if(this.axisValue == "banrate") return this.newY((Math.round((d.effectiveBans /  this.totalGames)  * 10000)) / 100)
                })
                .on("mouseover", this.mouseover )
                .on("mousemove", this.mousemove )
                .on("mouseleave", this.mouseleave )


            this.updatePosition(d3.select("#ChampScatter"), 25)
            this.show(d3.select("#ChampScatter"))
            
        },
        createSVG(){
            //tooltip
            d3.select("#ChampScatter")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("color", "black")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("position", "absolute")
                .style("padding", "10px")



            var svg = d3.select("#ChampScatter")
                .append("svg")
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
                .append("g")
                .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
                
            // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
            var zoom = d3.zoom()
                    .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
                    .extent([[0, 0], [this.width, this.height]])
                    .on("zoom", this.updateChart);

            // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
            svg.append("rect")
                .attr("width", this.width)
                .attr("height", this.height)
                .style("position", "absolute")
                .style("display", "block")
                .style("fill", "none")
                .style("pointer-events", "all")
                .call(zoom);

            this.xAxis = svg.append("g")
                .attr("transform", "translate(0," + this.height + ")")
                .call(d3.axisBottom(this.x));

            // y label
            this.yLabel = svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - this.margin.left)
                .attr("x", 0 - (this.height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Games")
                .style("fill", "white");

            this.xLabel = svg.append("text")
                .attr("y", 0 + this.height + (this.margin.bottom / 2))
                .attr("x", 0 + (this.width / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Winrate (%)")
                .style("fill", "white");

            this.yAxis = svg.append("g")
                .call(d3.axisLeft(this.y));

        var size = 10
        let yValue = 30
        for(let champClass in this.colours){
            this.generateLegend(svg, yValue, size, champClass)
            yValue += 20
        }
        // Add clipPath definition before creating the scatter plot container
        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("x", 0)
            .attr("y", 0);
            
        var scatter = svg.append('g')
                .attr("clip-path", "url(#clip)")
                .attr("class", "dataWrapper")
                // .style("width", "100%")
                // .style("height", "100%")
        //Read the data
        d3.json("http://localhost:5173/stats/wbpr.json").then((data) => {
            let values = Object.values(data['all'])
            this.totalGames = Object.values(data['all']).reduce((accumulator, point) =>  {return Number(accumulator) + Number(point.games)}, 0) /10
            this.totalBanrate = values.reduce((accumulator, point) => {
                return Number(accumulator) + ((Number(point.effectiveBans) / this.totalGames) * 100)
            }, 0)

            for(let rank in data){
                let totalGames = 0
                for(let champ in data[rank]){
                    totalGames +=  data[rank][champ]['games']
                }
                totalGames /= 10

                for(let champ in data[rank]){
                    data[rank][champ]['WR'] = (data[rank][champ]['wins'] / data[rank][champ]['games']) * 100
                    data[rank][champ]['BR'] = (data[rank][champ]['effectiveBans'] / totalGames) * 100
                    data[rank][champ]['name'] = champ
                    if(champ != "None")
                        data[rank][champ]['class'] = Champions.ClassesfromID(champ)[0]
                }

                delete data[rank]['None']
            }
            this.data = data
            this.selected_data = this.data['all']
            this.yLine = svg.append("line")
                .attr("class", "horizontal")
                .attr("x1", 0) 
                .attr("y1", this.y(this.totalGames / Object.values(data['all']).length * 10))
                .attr("x2", this.width)  
                .attr("y2", this.y(this.totalGames / Object.values(data['all']).length * 10))
                .style("stroke-width", 2)
                .style("stroke", "gray")
                .style("fill", "none")
                .style("stroke-dasharray", "4");

            this.renderData()
            this.show(d3.select("#ChampScatter"))
        })

        d3.json("http://localhost:5173/stats/wbpr_mastery.json").then((data) => {
            for(let mastery in data){
                for(let champ in data[mastery]){
                data[mastery][champ]['WR'] = (data[mastery][champ]['wins'] / data[mastery][champ]['games']) * 100
                data[mastery][champ]['name'] = champ
                }

                delete data[mastery]['None']
            }
            this.data_mastery = data
        })
        svg.append("line")
            .attr("class", "vertical")
            .attr("x1", this.x(50))
            .attr("y1", 0)
            .attr("x2", this.x(50))
            .attr("y2", this.height)
            .style("stroke-width", 2)
            .style("stroke", "gray")
            .style("fill", "none")
            .style("stroke-dasharray", "4");



        },
        updateChart(event){
            let size = 20
            // recover the new scale
            var newX = event.transform.rescaleX(this.x);
            var newY = event.transform.rescaleY(this.y);

            // update axes with these new boundaries
            this.xAxis.call(d3.axisBottom(newX))
            this.yAxis.call(d3.axisLeft(newY))

            let data = d3.select("#ChampScatter").selectAll("g").filter(
                function(d) { return d && d.name; }
            )

            data.selectAll("image")
                .attr("x", function (d) { return newX(d.WR) - size / 2; } )
                .attr("y", (d) => { 
                    if(this.axisValue == "games") {return newY(d.games)  - size / 2}
                    if(this.axisValue == "banrate") {return newY((Math.round((d.effectiveBans / this.totalGames)  * 10000)) / 100) - size / 2}
                })

            data.selectAll("rect")
                .attr("x", function (d) { return newX(d.WR) - size / 2; } )
                .attr("y", (d) => { 
                    if(this.axisValue == "games") {return newY(d.games)  - size / 2}
                    if(this.axisValue == "banrate") {return newY((Math.round((d.effectiveBans / this.totalGames)  * 10000)) / 100) - size / 2}
                })

            data.selectAll("circle")
                .attr("cx", function (d) { return newX(d.WR); } )
                .attr("cy", (d) => { 
                    if(this.axisValue == "games") {return newY(d.games)}
                    if(this.axisValue == "banrate") {return newY((Math.round((d.effectiveBans / this.totalGames)  * 10000)) / 100)}
                })
            
            d3.select("#ChampScatter").selectAll("line.vertical")
                .attr("x1", newX(50))
                .attr("x2", newX(50))
            
            d3.select("#ChampScatter").selectAll("line.horizontal")
                .attr("y1",() => { 
                    if(this.axisValue == "games")    { return newY(this.totalGames / Object.values(this.selected_data).length * 10) }
                    if(this.axisValue == "banrate")  { return newY(this.totalBanrate / Object.values(this.selected_data).length) }
                })
                .attr("y2", () => { 
                    if(this.axisValue == "games")    { return newY(this.totalGames / Object.values(this.selected_data).length * 10) }
                    if(this.axisValue == "banrate")  { return newY(this.totalBanrate / Object.values(this.selected_data).length) }
                })


            this.newX = newX
            this.newY = newY
        },
        generateLegend(svg, yValue, size, champClass){
            svg.append("rect").attr("x", 300).attr("y", yValue).attr("data-class", champClass).attr("width", size).attr("height", size).style("fill", this.colours[champClass])
            .on("mouseover", this.legend_mouseover).on("mouseleave", this.legend_mouseleave).on("click", this.legend_click)

            svg.append("text").attr("x", 320).attr("y", yValue + 10).attr("data-class", champClass).text(champClass).style("font-size", "15px").attr("alignment-baseline","middle").style("fill", this.colours[champClass])
            .on("mouseover", this.legend_mouseover).on("mouseleave", this.legend_mouseleave).on("click", this.legend_click)

        },
        legend_click(event, d) {
            if(this.name != "") return;
            
            let unfiltered = true;
            for(let tag in this.visible){
                unfiltered = unfiltered && this.visible[tag];
            }

            if(unfiltered){
                this.hide(d3.select("#ChampScatter"))
                for(let tag in this.visible){
                    this.visible[tag] = false;
                }
            }

            let champClass = d3.select(event.target).attr('data-class')
            let nodes = d3.select("#ChampScatter").selectAll(`.${champClass}`)

            if(this.visible[champClass]){
                this.hide(nodes)
                this.visible[champClass] = false;

            }else{
                this.show(nodes)
                this.visible[champClass] = true
            }
            this.$emit('legend_click', champClass)

        },
        legend_mouseleave(event, d) {
            if(this.name != "") return;
            for(let champClass in this.colours){
                let nodes = d3.select("#ChampScatter").selectAll(`.${champClass}`)
                if(!this.visible[champClass]){
                    this.hide(nodes)
                } 
                else{
                    this.show(nodes)
                } 
            }
            this.$emit('legend_mouseleave')
        },
        legend_mouseover(event, d) {
            if(this.name != "") return;
            let hoveredClass = d3.select(event.target).attr('data-class')

            if(!this.visible[hoveredClass]){
                let nodes = d3.select("#ChampScatter").selectAll(`.${hoveredClass}`)
                this.lowLight(nodes);
                return
            }

            for(let champClass in this.visible){
                let nodes = d3.select("#ChampScatter").selectAll(`.${champClass}`)
                if(champClass == hoveredClass){
                    this.highlight(nodes);
                }else{
                    if(this.visible[champClass]){
                        this.lowLight(nodes);
                    }
                }
            }
        },
        mouseleave(event, d) {
            if(!this.visible[d3.select(event.target.parentNode).attr("class")]) return;

            d3.select("#ChampScatter").select(`.tooltip`)
                .transition()
                .style("opacity", 0)
                .style("display", "none")
            if(this.name != "") return;
            for(let champClass in this.colours){
                if(this.visible[champClass]){
                    let nodes = d3.select("#ChampScatter").selectAll(`.${champClass}`)
                    this.show(nodes)
                } 
            }

        },
        mousemove(event, d) {
            let totalGames = this.totalGames 
            if(!this.visible[d3.select(event.target.parentNode).attr("class")]) return;

            d3.select("#ChampScatter").select(`.tooltip`)
                .html(`${Champions.nameFromID(d.name)}<br>Games: ${d.games}<br>WR: ${Math.round(d.WR * 100) / 100}% <br>BR: ${Math.round(d.BR * 100) / 100}%`)
                .style("left", (event.x) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", (event.y)+ "px")
                .style("display", "block")
        },
        mouseover(event, d) {
            let champClass = d3.select(event.target.parentNode).attr("class")
            if(!this.visible[champClass]) return;

            d3.select("#ChampScatter").select(`.tooltip`)
                .style("opacity", 1)            
                .html(`${Champions.nameFromID(d.name)}<br>Games: ${d.games}<br>WR: ${Math.round(d.WR * 100) / 100}% <br>BR: ${Math.round(Number(d.effectiveBans) / this.totalGames) * 10000 / 100}%`)
                .style("left", (event.x) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", (event.y)+ "px")
                .style("display", "block")
            if(this.name != "") return;

            for(let champClass in this.visible){
                if(!this.visible[champClass]) continue;
                let nodes = d3.select("#ChampScatter").selectAll(`.${champClass}`)
                this.lowLight(nodes);
            }
            d3.select(event.target.parentNode).raise()
            d3.select(event.target)
                .transition()
                .duration(200)
                .style("opacity", 1)

            if(!this.displayIcons){
                d3.select(event.target).transition()
                    .duration(200)
                    .attr("r", 6)
            }else{
                d3.select(event.target.parentNode).select('rect').transition()
                    .duration(200)
                    .style("stroke", this.colours[champClass])
            }
        }
    },
    mounted(){
        this.createSVG()
    }
}


</script>



<style lang="scss" scoped>

</style>