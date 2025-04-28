
<template>
    <div id="BannedScatter"></div>
</template>
<script  lang="js">
import * as d3 from "d3" ;
import { Rainbow } from '@indot/rainbowvis';
import Champions from "@/classes/Champion.ts";
import { computed, ref} from 'vue'

export default{
    name: "BannedScatter",
    setup(){
        let minBans = 0;
        let maxBans = 0;
        let totalBans = 0;
        let totalGames = 0;
        const rb = new Rainbow()
        const displayIcons = ref(false)

        rb.setSpectrum('#000000', '#ffffff')
        let data = undefined
        let selected_data = undefined
        const margin = {top: 10, right: 30, bottom: 30, left: 60}
        const width = 460 - margin.left - margin.right
        const height = 400 - margin.top - margin.bottom
    
        const x = d3.scaleLinear()
                    .domain([42, 58])
                    .range([ 0, width ]);

        let y = d3.scaleLinear()
                    .domain([0, 60000])
                    .range([ height, 0]);


        const visible = {
            "Controller": true,
            "Fighter": true,
            "Mage": true,
            "Marksman": true,
            "Tank": true,
            "Specialist": true,
            "Slayer": true,
        }
        let yAxis = undefined
        let xAxis = undefined
        let yLine = undefined
        let axisValue = "games"
        let rank = "all"

        return{
            rb,
            displayIcons,
            visible,
            totalGames,
            x,
            y,
            yAxis,
            yLine,
            axisValue,
            margin,
            width,
            height,
            minBans,
            maxBans,
            totalBans,
            data,
            selected_data,
            rank
        }
    },
    methods: {
        mostGames(){
            return Object.values(this.selected_data).reduce((accumulator, point) =>  {return Math.max(Number(accumulator), Number(point.games))}, 0)
        },
        highestWinDelta(){
            return Object.values(this.selected_data).reduce((accumulator, point) =>  {return Math.max(Number(accumulator), Math.abs(50 - Number(point.WR)))}, 0)
        },
        highestPresence(){
            let totalGames = this.totalGames
            return Object.values(this.selected_data).reduce((accumulator, point) =>  {return Math.max(Number(accumulator), ((Number(point.effectiveBans) / totalGames + Number(point.games) / totalGames)  * 100))}, 0)
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
                    .attr("y1", this.y(this.totalGames / Object.values(this.selected_data).length * 10))
                    .attr("x2", this.width)  
                    .attr("y2", this.y(this.totalGames / Object.values(this.selected_data).length * 10))
                    .style("stroke-width", 2)
                    .style("stroke", "gray")
                    .style("fill", "none")
                    .style("stroke-dasharray", "4");
            }else if(axisValue == "presence"){
                this.y = d3.scaleLinear()
                    .domain([0, Math.ceil(this.highestPresence() / 5) * 5])
                    .range([this.height, 0]);
                this.yLine.attr("x1", 0)  
                    .attr("y1", this.y(this.totalPresence / Object.values(this.selected_data).length))
                    .attr("x2", this.width)
                    .attr("y2", this.y(this.totalPresence / Object.values(this.selected_data).length))
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
        setMastery(){
            for(let champClass in this.visible){
                this.hideClass(champClass)
            }
        },
        setIcons(displayIcons){
            this.displayIcons = displayIcons
            this.showAll()
        },
        showAll(){
            
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
            if(this.displayIcons){
                let size = 20
                d3.select("#BannedScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("image").transition()
                    .duration(200)
                    .style("opacity", 0.33)
                    .style("display", "block")
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .attr("width", size)
                    .attr("height", size)

                d3.select("#BannedScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("rect").transition()
                    .duration(200)
                    .style("stroke", "lightgrey")
                    .style("opacity", 0.33)
                    .style("display", "block")
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .attr("width", size)
                    .attr("height", size)
            }else{
                d3.select("#BannedScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("circle").transition()
                    .duration(200)
                    .style("fill", "lightgrey")
                    .style("opacity", 0.33)
                    .style("display", "block")
                    .attr("cx", function (d) { return x(d.WR); } )
                    .attr("cy", function (d) { 
                        if(axisValue == "games") {return y(d.games)}
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100)}
                    })
                    .attr("r", 4)
            }
        },
        showClass(champClass){
            let rb = new Rainbow().setNumberRange(this.minBans, this.maxBans)
            rb.setSpectrum('#ffffff', '#ff0000', '000000')
            let size = 25
            let totalGames = this.totalGames
            let axisValue = this.axisValue  
            let x = this.x
            let y = this.y 

            if(this.displayIcons){
                d3.select("#BannedScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("image").transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("display", "block")
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .attr("width", size)
                    .attr("height", size)


                d3.select("#BannedScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("rect").transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("display", "block")
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .attr("width", size)
                    .attr("height", size)
                    .style("stroke", function(d) {return `#${rb.colourAt(d.effectiveBans)}`})

                d3.select("#BannedScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("circle").transition()
                    .duration(200)
                    .attr("r", 5)
                    .style("opacity", 1)
                    .style("display", "none")
                    .attr("cx", function (d) { return x(d.WR); } )
                    .attr("cy", function (d) { 
                        if(axisValue == "games") {return y(d.games)}
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100)}
                    })
                    .style("fill", function(d) {return `#${rb.colourAt(d.effectiveBans)}`})
            }else{
                d3.select("#BannedScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("image").transition()
                    .duration(200)
                    .style("display", "none")
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .attr("width", size)
                    .attr("height", size)

                d3.select("#BannedScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("rect").transition()
                    .duration(200)
                    .style("display", "none")
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .attr("width", size)
                    .attr("height", size)
                    .style("stroke", function(d) {return `#${rb.colourAt(d.effectiveBans)}`})

                d3.select("#BannedScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("circle").transition()
                    .duration(200)
                    .attr("r", 5)
                    .style("opacity", 1)
                    .style("display", "block")
                    .attr("cx", function (d) { return x(d.WR); } )
                    .attr("cy", function (d) { 
                        if(axisValue == "games") {return y(d.games)}
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100)}
                    })
                    .style("fill", function(d) {return `#${rb.colourAt(d.effectiveBans)}`})
            }
        },
        highlightClass(champClass){
            let rb = new Rainbow().setNumberRange(this.minBans, this.maxBans)
            rb.setSpectrum('#ffffff', '#ff0000', '000000')
            d3.select("#BannedScatter")
            .selectAll(`.${champClass}`).raise()
            let totalGames = this.totalGames
            let axisValue = this.axisValue  
            let x = this.x
            let y = this.y 
            if(this.displayIcons){
                let size = 30
                d3.select("#BannedScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("rect").transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("display", "block")
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .attr("width", size)
                    .attr("height", size)
                    .style("stroke", function(d) {return `#${rb.colourAt(d.effectiveBans)}`})

                d3.select("#BannedScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("image").transition()
                    .duration(200)
                    .style("opacity", 1)
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) {
                        if(axisValue == "games") {return y(d.games) - size / 2}
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .attr("width", size)
                    .attr("height", size)
            }else{

                d3.select("#BannedScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("circle").transition()
                    .duration(200)
                    .style("opacity", 1)
                    .attr("cx", function (d) { return x(d.WR); } )
                    .attr("cy", function (d) { 
                        if(axisValue == "games") {return y(d.games)}
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100)}
                    })
                    .attr("r", 6)
                    .style("fill", function(d) {return `#${rb.colourAt(d.effectiveBans)}`})

            }
        },
        hideClass(champClass){
            if(this.displayIcons){
                d3.select("#BannedScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("image").transition()
                    .duration(200)
                    .style("display", "none")

                d3.select("#BannedScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("rect").transition()
                    .duration(200)
                    .style("display", "none")
            }else{
                d3.select("#BannedScatter")
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

            d3.select("#BannedScatter").select(`.dataWrapper`).selectAll("*").remove()

            let groups = d3.select("#BannedScatter").select(`.dataWrapper`)
                .selectAll("dot")
                .data(Object.values(Object(this.selected_data)))
                .enter()
                .append('g')
                .attr("class", function (d) {return Champions.ClassesfromID(d.name)[0]; })         

            groups.append('image')
                .attr("x", function (d) {return x(d.WR) - size / 2; } )
                .attr("y", function (d) {
                    if(axisValue == "games") {return y(d.games) - size / 2}
                    if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100) - size / 2}
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
                .attr("cy", function (d) { if(axisValue == "games") {return y(d.games) - size / 2}
                                           if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100);}})
                .attr("r", 5)
                .style("display", "none")
                .style("fill", "#69b3a2")
                .style("stroke", "black")
                .on("mouseover", this.mouseover )
                .on("mousemove", this.mousemove )
                .on("mouseleave", this.mouseleave )

            let visData = Object.values(Object(this.selected_data)).filter((d) => this.visible[Champions.ClassesfromID(d.name)[0]])
            this.totalBans = visData.reduce((accumulator, point) =>  {return Number(accumulator) + Number(point.effectiveBans)}, 0)
            this.maxBans = visData.reduce((accumulator, point) =>  {return Math.max(Number(accumulator), Number(point.effectiveBans))}, 0)
            this.minBans = visData.reduce((accumulator, point) =>  {return Math.min(Number(accumulator), Number(point.effectiveBans))}, Infinity)
            this.showAll()

        },
        createSVG(){
            var tooltip = d3.select("#BannedScatter")
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


            var svg = d3.select("#BannedScatter")
                .append("svg")
                    .attr("width",  this.width + this.margin.left + this.margin.right)
                    .attr("height", this.height + this.margin.top + this.margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
            // Add X axis

        this.xAxis = svg.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x));


            
        this.yAxis = svg.append("g")
            .call(d3.axisLeft(this.y));

        var size = 10
        let yValue = 30

 
        var scatter = svg.append('g')
                .attr("clip-path", "url(#clip)")
                .attr("class", "dataWrapper")
        //Read the data
        d3.json("http://localhost:5173/stats/wbpr.json").then((data) => {
            let values = Object.values(data['all'])
            this.totalGames = values.reduce((accumulator, point) =>  {return Number(accumulator) + Number(point.games)}, 0) /10
            this.totalPresence = values.reduce((accumulator, point) => {
                return Number(accumulator) + ((Number(point.effectiveBans) / this.totalGames + Number(point.games) / this.totalGames) * 100)
            }, 0)

            for(let rank in data){
                for(let champ in data[rank]){
                data[rank][champ]['WR'] = (data[rank][champ]['wins'] / data[rank][champ]['games']) * 100
                data[rank][champ]['name'] = champ
                }

                delete data[rank]['None']
            }
            this.data = data
            this.selected_data = this.data['all']

            this.renderData()
            this.showAll()
            this.yLine = svg.append("line")
                .attr("x1", 0) 
                .attr("y1", this.y(this.totalGames / Object.values(data['all']).length * 10))
                .attr("x2", this.width)  
                .attr("y2", this.y(this.totalGames / Object.values(data['all']).length * 10))
                .style("stroke-width", 2)
                .style("stroke", "gray")
                .style("fill", "none")
                .style("stroke-dasharray", "4");
        })
        

        svg.append("line")
            .attr("x1", this.x(50))  //<<== change your code here
            .attr("y1", 0)
            .attr("x2", this.x(50))  //<<== and here
            .attr("y2", this.height)
            .style("stroke-width", 2)
            .style("stroke", "gray")
            .style("fill", "none")
            .style("stroke-dasharray", "4");

        },   
        generateLegend(svg, yValue, size, champClass){
        },
        legend_click(champClass) {
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
            this.visible[champClass] = !this.visible[champClass]
            let visData = this.data.filter((d) => (this.visible[Champions.ClassesfromID(d.name)[0]]))
            this.totalBans = visData.reduce((accumulator, point) =>  {return Number(accumulator) + Number(point.effectiveBans)}, 0)
            this.maxBans = visData.reduce((accumulator, point) =>  {return Math.max(Number(accumulator), Number(point.effectiveBans))}, 0)
            this.minBans = visData.reduce((accumulator, point) =>  {return Math.min(Number(accumulator), Number(point.effectiveBans))}, Infinity)
            if(this.visible[champClass]){
                this.showClass(champClass)
            }else{
                this.hideClass(champClass)
            }
        },
        legend_mouseleave(event, d) {
            for(let champClass in this.visible){
                if(!this.visible[champClass]){
                    this.hideClass(champClass)
                } 
                else{
                    this.showClass(champClass)
                } 
            }
        },
        legend_mouseover(champClass) {
            if(!this.visible[champClass]){
                this.lowLightClass(champClass);
                return
            }

            for(let cls in this.visible){
                if(cls == champClass){
                    this.highlightClass(cls);
                }else{
                    if(!this.visible[cls]) continue;
                    this.lowLightClass(cls);
                }
            }
        },
        mouseleave(event, d) {
            if(!this.visible[d3.select(event.target.parentNode).attr("class")]) return;

            d3.select("#BannedScatter").select(`.tooltip`)
                .transition()
                .style("opacity", 0)
                .style("display", "none")

            for(let champClass in this.visible){
                if(this.visible[champClass]){
                    this.showClass(champClass)
                } 
            }

        },
        mousemove(event, d) {
            if(!this.visible[d3.select(event.target.parentNode).attr("class")]) return;

            d3.select("#BannedScatter").select(`.tooltip`)
                .html(`${Champions.nameFromID(d.name)}<br>Bans: ${d.effectiveBans} (${Math.round(d.effectiveBans/this.totalBans * 10000)/100}%)`)
                .style("left", (event.x) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", (event.y)+ "px")
                .style("display", "block")
        },
        mouseover(event, d) {
            let champClass = d3.select(event.target.parentNode).attr("class")
            if(!this.visible[champClass]) return;
            d3.select("#BannedScatter").select(`.tooltip`)
                .style("opacity", 1)            
                .html(`${Champions.nameFromID(d.name)}<br>Bans: ${d.effectiveBans} (${Math.round(d.effectiveBans/this.totalBans * 10000)/100}%)`)
                .style("left", (event.x) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", (event.y)+ "px")
                .style("display", "block")
            
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