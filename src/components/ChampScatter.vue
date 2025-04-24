
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
        const x = d3.scaleLinear()
                        .domain([42, 58])
                        .range([ 0, width ])

        let y = d3.scaleLinear()
                    .domain([0, 80000])
                    .range([ height, 0]);

        let totalGames = 0
        let totalPresence = 0
        let yAxis = undefined
        let yLine = undefined
        let axisValue = "games"
        return{
            data,
            displayIcons,
            colours,
            visible,
            totalGames,
            totalPresence,
            x,
            y,
            yAxis,
            yLine,
            axisValue,
            margin,
            width,
            height
        }
    },
    methods: {
        setDisplay(axisValue){
            this.axisValue = axisValue
            if(axisValue == "games"){
                this.y = d3.scaleLinear()
                    .domain([0, 80000])
                    .range([this.height, 0]);
                this.yLine.attr("x1", 0)  
                    .attr("y1", this.y(this.totalGames / this.data.length * 10))
                    .attr("x2", this.width)  
                    .attr("y2", this.y(this.totalGames /this.data.length * 10))
                    .style("stroke-width", 2)
                    .style("stroke", "gray")
                    .style("fill", "none")
                    .style("stroke-dasharray", "4");
            }else if(axisValue == "presence"){
                this.y = d3.scaleLinear()
                    .domain([0, 100])
                    .range([this.height, 0]);
                this.yLine.attr("x1", 0)  
                    .attr("y1", this.y(this.totalPresence / this.data.length))
                    .attr("x2", this.width)
                    .attr("y2", this.y(this.totalPresence /this.data.length))
                    .style("stroke-width", 2)
                    .style("stroke", "gray")
                    .style("fill", "none")
                    .style("stroke-dasharray", "4");
            }
            this.yAxis.transition()
            .duration(200).call(d3.axisLeft(this.y));
            this.showAll()
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
                d3.select("#ChampScatter")
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
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100) - size / 2}
                    })
                    .attr("width", size)
                    .attr("height", size)
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
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100)}
                    })
                    .attr("r", 4)
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
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100) - size / 2}
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
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100) - size / 2}
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
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100)}
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
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100) - size / 2}
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
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100) - size / 2}
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
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100)}
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
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100) - size / 2}
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
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100) - size / 2}
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
                        if(axisValue == "presence") {return y((Math.round((d.effectiveBans / totalGames + d.games / totalGames)  * 10000)) / 100)}
                    })
                    .attr("r", 6)
                    .style("fill", this.colours[champClass])
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

            let groups = d3.select("#ChampScatter").select(`.dataWrapper`)
                .selectAll("dot")
                .data(this.data)
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
                // .attr("class", function (d) {return Champions.ClassesfromID(d.name)[0]; })         
                .on("mouseover", this.mouseover )
                .on("mousemove", this.mousemove )
                .on("mouseleave", this.mouseleave )

            groups.append('rect')
                .attr("x", function (d) { return x(d.WR) - size / 2 } )
                .attr("y", function (d) { return  y(d.games) - size / 2 + 1; } )
                // .attr("class", function (d) { return Champions.ClassesfromID(d.name)[0]; })
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

            //X axis
            svg.append("g")
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
                let values = Object.values(data)
                this.totalGames = values.reduce((accumulator, point) =>  {return Number(accumulator) + Number(point.games)}, 0) /10
                console.log(this.totalGames)
                this.totalPresence = values.reduce((accumulator, point) => {
                    return Number(accumulator) + ((Number(point.effectiveBans) / this.totalGames + Number(point.games) / this.totalGames) * 100)
                }, 0)

                for(let champ in data){
                    data[champ]['WR'] = (data[champ]['wins'] / data[champ]['games']) * 100
                    data[champ]['name'] = champ
                }

                delete data['None']
                this.data = Object.values(data)

                this.renderData()
                this.showAll()

                this.yLine = svg.append("line")
                    .attr("x1", 0) 
                    .attr("y1", this.y(this.totalGames / this.data.length * 10))
                    .attr("x2", this.width)  
                    .attr("y2", this.y(this.totalGames / this.data.length * 10))
                    .style("stroke-width", 2)
                    .style("stroke", "gray")
                    .style("fill", "none")
                    .style("stroke-dasharray", "4");
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

            for(let champClass in this.colours){
                if(this.visible[champClass]){
                    this.showClass(champClass)
                    // showClassBans(champClass)
                } 
            }

        },
        mousemove(event, d) {
            let totalGames = this.totalGames 
            if(!this.visible[d3.select(event.target.parentNode).attr("class")]) return;

            d3.select("#ChampScatter").select(`.tooltip`)
                .html(`${Champions.nameFromID(d.name)}<br>Games: ${d.games}<br>WR: ${Math.round(d.WR * 100) / 100}% `)
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
                .html(`${Champions.nameFromID(d.name)}<br>Games: ${d.games}<br>WR: ${Math.round(d.WR * 100) / 100}%<br>`)
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