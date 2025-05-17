
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

        let y = d3.scaleLinear()
                    .domain([0, 60000])
                    .range([ height, 0]);

        let totalGames = 0
        let totalBanrate = 0
        let yAxis = undefined
        let xAxis = undefined
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
            y,
            yAxis,
            xAxis,
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
                if(this.rank == 'GRANDMASTER'){
                    this.y = d3.scaleLinear()
                        .domain([0, Math.ceil(this.mostGames() / 500) * 500])
                        .range([this.height, 0]);
                }else{
                    this.y = d3.scaleLinear()
                        .domain([0, Math.ceil(this.mostGames() / 1000) * 1000])
                        .range([this.height, 0]);
                }
                this.yLine.attr("x1", 0)  
                    .attr("y1", this.y(this.totalGames / Object.values( this.selected_data).length * 10))
                    .attr("x2", this.width)  
                    .attr("y2", this.y(this.totalGames /Object.values( this.selected_data).length * 10))
                    .style("stroke-width", 2)
                    .style("stroke", "gray")
                    .style("fill", "none")
                    .style("stroke-dasharray", "4");
            }else if(axisValue == "banrate"){
                this.y = d3.scaleLinear()
                    .domain([0, Math.ceil(this.highestBanrate() / 5) * 5])
                    .range([this.height, 0]);
                this.yLine.attr("x1", 0)  
                    .attr("y1", this.y(this.totalBanrate / Object.values(this.selected_data).length))
                    .attr("x2", this.width)
                    .attr("y2", this.y(this.totalBanrate /Object.values(this.selected_data).length))
                    .style("stroke-width", 2)
                    .style("stroke", "gray")
                    .style("fill", "none")
                    .style("stroke-dasharray", "4");
            }

            this.yAxis.transition()
            .duration(200).call(d3.axisLeft(this.y));

            this.showAll()
            
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

            this.setDisplay(this.axisValue)
            this.renderData(this.selected_data)
        },
        setIcons(displayIcons){
            this.displayIcons = displayIcons
            this.showAll()
        },
        showAll(){
            if(this.name != ""){
                this.highlightName(this.name)
                return
            }
            for(let champClass in this.visible){
                if(this.visible[champClass]){
                    this.showClass(champClass)
                }else{
                    this.hideClass(champClass)
                }
            }
        },
        lowLightClass(champClass){  
            let totalGames = this.totalGames 
            let axisValue = this.axisValue  
            let x = this.x
            let y = this.y
            let size = 20
            
            if(this.displayIcons){
                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("image").transition()
                    .duration(200)
                    .style("opacity", 0.33)
                    .style("display", "block")
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .attr("width", size)
                    .attr("height", size)

                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("rect").transition()
                    .duration(200)
                    .style("stroke", "lightgrey")
                    .style("opacity", 0.33)
                    .style("display", "block")
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .attr("width", size)
                    .attr("height", size)

                    d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("circle").transition()
                    .duration(200)
                    .style("fill", "lightgrey")
                    .style("opacity", 0.33)
                    .style("display", "none")
                    .attr("cx", function (d) { return x(d.WR); } )
                    .attr("cy", function (d) { 
                        if(axisValue == "games") {return y(d.games)}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100)}
                    })
                    .attr("r", 4)
            }else{
                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("circle").transition()
                    .duration(200)
                    .style("fill", "lightgrey")
                    .style("opacity", 0.33)
                    .style("display", "block")
                    .attr("cx", function (d) { return x(d.WR); } )
                    .attr("cy", function (d) { 
                        if(axisValue == "games") {return y(d.games)}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100)}
                    })
                    .attr("r", 4)

                    d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("image").transition()
                    .duration(200)
                    .style("opacity", 0.33)
                    .style("display", "none")
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .attr("width", size)
                    .attr("height", size)

                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("rect").transition()
                    .duration(200)
                    .style("stroke", "lightgrey")
                    .style("opacity", 0.33)
                    .style("display", "none")
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .attr("width", size)
                    .attr("height", size)
            }

        },
        showClass(champClass){
            let size = 25
            let x = this.x
            let y = this.y
            let totalGames = this.totalGames 
            let axisValue = this.axisValue
            if(this.displayIcons){
                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("image").transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("display", "block")
                    .attr("x", function (d) { return x(d.WR) - size / 2 } )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .attr("width", size)
                    .attr("height", size)

                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("rect").transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("display", "block")
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .attr("width", size)
                    .attr("height", size)
                    .style("stroke", this.colours[champClass])

                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("circle").transition()
                    .duration(200)
                    .attr("r", 5)
                    .style("opacity", 1)
                    .style("display", "none")
                    .attr("cx", function (d) { return x(d.WR); } )
                    .attr("cy", function (d) { 
                        if(axisValue == "games") {return y(d.games)}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100)}
                    })
                    .style("fill", this.colours[champClass])
            }else{
                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("image").transition()
                    .duration(200)
                    .style("display", "none")
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .style("fill", this.colours[champClass])

                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("rect").transition()
                    .duration(200)
                    .style("display", "none")
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .style("stroke", this.colours[champClass])

                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("circle").transition()
                    .duration(200)
                    .attr("r", 5)
                    .style("opacity", 1)
                    .style("display", "block")
                    .attr("cx", function (d) { return x(d.WR); } )
                    .attr("cy", function (d) { 
                        if(axisValue == "games") {return y(d.games)}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100)}
                    })
                    .style("fill", this.colours[champClass])
            }
        },
        highlightClass(champClass){

            d3.select("#ChampScatter")
            .selectAll(`.${champClass}`).raise()
            let totalGames = this.totalGames 
            let axisValue = this.axisValue  
            let x = this.x
            let y = this.y 
            if(this.displayIcons){
                let size = 30
                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("image").transition()
                    .duration(200)
                    .style("opacity", 1)
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .attr("width", size)
                    .attr("height", size)

                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("rect").transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("display", "block")
                    .attr("x", function (d) { return x(d.WR) - size / 2} )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .attr("width", size)
                    .attr("height", size)
                    .style("stroke", this.colours[champClass])
            }else{
                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("circle").transition()
                    .duration(200)
                    .style("opacity", 1)
                    .attr("cx", function (d) { return x(d.WR); } )
                    .attr("cy", function (d) { 
                        if(axisValue == "games") {return y(d.games)}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100)}
                    })
                    .attr("r", 6)
                    .style("fill", this.colours[champClass])
            }
        },
        highlightName(name){
            this.name = name
            for(let champClass in this.visible){
                if(this.visible[champClass]){
                    this.lowLightClass(champClass)
                }
            }

            let totalGames = this.totalGames 
            let axisValue = this.axisValue  
            let x = this.x
            let y = this.y 
            let colours = this.colours 
            let visible = this.visible 
            let size = 25
            
            let nodes = d3.select("#ChampScatter").selectAll("g").filter(
                function(d) { return d && d.name && d.name.toLowerCase().includes(name.toLowerCase()) && visible[Champions.ClassesfromID(d.name)[0]]; 

                })
            nodes.raise()
            if(this.displayIcons){
                let size = 30
                nodes.selectAll("image").transition()
                    .duration(200)
                    .style("opacity", 1)
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .attr("width", size)
                    .attr("height", size)

                nodes.selectAll("rect").transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("display", "block")
                    .attr("x", function (d) { return x(d.WR) - size / 2} )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .attr("width", size)
                    .attr("height", size)
                    .style("stroke", function (d) {return colours[Champions.ClassesfromID(d.name)[0]]})

                nodes.selectAll("circle").transition()
                    .duration(200)
                    .attr("r", 5)
                    .style("opacity", 1)
                    .style("display", "none")
                    .attr("cx", function (d) { return x(d.WR); } )
                    .attr("cy", function (d) { 
                        if(axisValue == "games") {return y(d.games)}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100)}
                    })
                    .style("fill", function (d) {return colours[Champions.ClassesfromID(d.name)[0]]})

            }else{
                nodes.selectAll("image").transition()
                    .duration(200)
                    .style("display", "none")
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames )  * 10000)) / 100) - size / 2}
                    })

                nodes.selectAll("rect").transition()
                    .duration(200)
                    .style("display", "none")
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .style("stroke", function (d) {return colours[Champions.ClassesfromID(d.name)[0]]})

                nodes.selectAll("circle").transition()
                    .duration(200)
                    .style("opacity", 1)
                    .attr("cx", function (d) { return x(d.WR); } )
                    .attr("cy", function (d) { 
                        if(axisValue == "games") {return y(d.games)}
                        if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100)}
                    })
                    .attr("r", 6)
                    .style("fill", function (d) {return colours[Champions.ClassesfromID(d.name)[0]]})
            }

        },
        hideClass(champClass){
            if(this.displayIcons){
                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("image").transition()
                    .duration(200)
                    .style("display", "none")

                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("rect").transition()
                    .duration(200)
                    .style("display", "none")
            }else{
                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("circle").transition()
                    .duration(200)
                    .attr("r", 5)
                    .style("display", "none")
            }
        },
        renderData(){
            let size = 25
            let x = this.x
            let y = this.y
            let totalGames = this.totalGames 
            let axisValue = this.axisValue
            d3.select("#ChampScatter").select(`.dataWrapper`).selectAll("*").remove()
            
            let groups = d3.select("#ChampScatter").select(`.dataWrapper`)
                .selectAll("dot")
                .data(Object.values(Object(this.selected_data)))
                .enter()
                .append('g')
                .attr("class", function (d) {return Champions.ClassesfromID(d.name)[0]; })         

            groups.append('image')
                .attr("x", function (d) {return x(d.WR) - size / 2; } )
                .attr("y", function (d) {
                    if(axisValue == "games") {return y(d.games) - size / 2}
                    if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100) - size / 2}
                })
                .attr("width", size)
                .attr("height", size)
                .style("display", "none")
                .attr("href", function (d) {return Champions.iconPathFromID(d.name)})
                .on("mouseover", this.mouseover )
                .on("mousemove", this.mousemove )
                .on("mouseleave", this.mouseleave )

            groups.append('rect')
                .attr("x", function (d) { return x(d.WR) - size / 2 } )
                .attr("y", function (d) { return  y(d.games) - size / 2 + 1; } )
                .attr("width", size)
                .attr("height", size)
                .style("display", "none")
                .style("fill", "none")
                .style("stroke", "black")
                .style("stroke-width", "2px")

            groups.append("circle")
                .attr("cx", function (d) { return x(d.WR); } )
                .attr("cy", function (d) { 
                    if(axisValue == "games") {return y(d.games) - size / 2}
                    if(axisValue == "banrate") {return y((Math.round((d.effectiveBans / totalGames)  * 10000)) / 100);}
                })
                .attr("r", 5)
                .style("display", "none")
                .style("fill", "#69b3a2")
                .style("stroke", "black")
                .on("mouseover", this.mouseover )
                .on("mousemove", this.mousemove )
                .on("mouseleave", this.mouseleave )


            this.showAll()
            
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

        this.xAxis = svg.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x));

        this.yAxis = svg.append("g")
            .call(d3.axisLeft(this.y));

        var size = 10
        let yValue = 30
        for(let champClass in this.colours){
            this.generateLegend(svg, yValue, size, champClass)
            yValue += 20
        }
 
        var scatter = svg.append('g')
                .attr("clip-path", "url(#clip)")
                .attr("class", "dataWrapper")
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
                }

                delete data[rank]['None']
            }
            this.data = data
            this.selected_data = this.data['all']
            this.yLine = svg.append("line")
                .attr("x1", 0) 
                .attr("y1", this.y(this.totalGames / Object.values(data['all']).length * 10))
                .attr("x2", this.width)  
                .attr("y2", this.y(this.totalGames / Object.values(data['all']).length * 10))
                .style("stroke-width", 2)
                .style("stroke", "gray")
                .style("fill", "none")
                .style("stroke-dasharray", "4");

            this.renderData()
            this.showAll()
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
            .attr("x1", this.x(50))
            .attr("y1", 0)
            .attr("x2", this.x(50))
            .attr("y2", this.height)
            .style("stroke-width", 2)
            .style("stroke", "gray")
            .style("fill", "none")
            .style("stroke-dasharray", "4");

        },   
        generateLegend(svg, yValue, size, champClass){
            svg.append("rect").attr("x", 300).attr("y", yValue).attr("width", size).attr("class", champClass).attr("height", size).style("fill", this.colours[champClass])
            .on("mouseover", this.legend_mouseover).on("mouseleave", this.legend_mouseleave).on("click", this.legend_click)

            svg.append("text").attr("x", 320).attr("y", yValue + 10).text(champClass).attr("class", champClass).style("font-size", "15px").attr("alignment-baseline","middle").style("fill", this.colours[champClass])
            .on("mouseover", this.legend_mouseover).on("mouseleave", this.legend_mouseleave).on("click", this.legend_click)

        },
        legend_click(event, d) {
            console.log(this.name)
            if(this.name != "") return;
            
            let unfiltered = true;
            for(let tag in this.visible){
                unfiltered = unfiltered && this.visible[tag];
            }

            if(unfiltered){
                for(let tag in this.visible){
                    this.hideClass(tag)
                    this.visible[tag] = false;
                }
            }
            let champClass = d3.select(event.target).attr('class')

            if(this.visible[champClass]){
                this.hideClass(champClass)
                this.visible[champClass] = false;

            }else{
                this.showClass(champClass)
                this.visible[champClass] = true
            }
            this.$emit('legend_click', champClass)

        },
        legend_mouseleave(event, d) {
            if(this.name != "") return;
            for(let champClass in this.colours){
                if(!this.visible[champClass]){
                    this.hideClass(champClass)
                } 
                else{
                    this.showClass(champClass)
                } 
            }
            this.$emit('legend_mouseleave')
        },
        legend_mouseover(event, d) {
            if(this.name != "") return;
            let hoveredClass = d3.select(event.target).attr('class')
            this.$emit('legend_mouseover', hoveredClass)
            if(!this.visible[hoveredClass]){
                this.lowLightClass(hoveredClass);
                return
            }

            for(let champClass in this.visible){
                if(champClass == hoveredClass){
                    this.highlightClass(champClass);
                }else{
                    if(!this.visible[champClass]) continue;
                    this.lowLightClass(champClass);
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
                    this.showClass(champClass)
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
            let totalGames = this.totalGames 
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
                this.lowLightClass(champClass);
            }
            d3.select(event.target.parentNode).raise()
            d3.select(event.target)
                .transition()
                .duration(200)
                .attr("opacity", 1)

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