
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
                        .domain([43, 57])
                        .range([ 0, width ])

        const y = d3.scaleLinear()
                    .domain([0, 150000])
                    .range([ height, 0])

        return{
            displayIcons,
            colours,
            visible,
            x,
            y,
            margin,
            width,
            height
        }
    },
    methods: {
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
            if(this.displayIcons){
                let size = 20
                let x = this.x
                let y = this.y
                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("image").transition()
                    .duration(200)
                    .style("opacity", 0.33)
                    .style("display", "block")
                    .attr("x", function (d) { return x(d.WR) - size / 2 + 1; } )
                    .attr("y", function (d) { return  y(d.Games) - size / 2 + 1; } )
                    .attr("width", size - 2)
                    .attr("height", size - 2)

                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("rect").transition()
                    .duration(200)
                    .style("stroke", "lightgrey")
                    .style("opacity", 0.33)
                    .style("display", "block")
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) { return y(d.Games) - size / 2; } )
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
                    .attr("r", 4)
            }

        },
        showClass(champClass){
            let size = 25
            let x = this.x
            let y = this.y

            if(this.displayIcons){
                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("image").transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("display", "block")
                    .attr("x", function (d) { return x(d.WR) - size / 2 + 1; } )
                    .attr("y", function (d) { return  y(d.Games) - size / 2 + 1; } )
                    .attr("width", size - 2)
                    .attr("height", size - 2)

                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("rect").transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("display", "block")
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) { return y(d.Games) - size / 2; } )
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
                    .attr("cy", function (d) { return y(d.Games); } )
                    .style("fill", this.colours[champClass])
            }else{
                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("image").transition()
                    .duration(200)
                    .style("display", "none")
                    .style("fill", this.colours[champClass])

                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("rect").transition()
                    .duration(200)
                    .style("display", "none")
                    .style("stroke", this.colours[champClass])

                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("circle").transition()
                    .duration(200)
                    .attr("r", 5)
                    .style("opacity", 1)
                    .style("display", "block")
                    .style("fill", this.colours[champClass])
            }
        },
        highlightClass(champClass){
            d3.select("#ChampScatter")
            .selectAll(`.${champClass}`).raise()
            if(this.displayIcons){
                let size = 30
                let x = this.x
                let y = this.y
                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("image").transition()
                    .duration(200)
                    .style("opacity", 1)
                    .attr("x", function (d) { return x(d.WR) - size / 2 + 1; } )
                    .attr("y", function (d) { return  y(d.Games) - size / 2 + 1; } )
                    .attr("width", size - 2)
                    .attr("height", size - 2)

                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("rect").transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("display", "block")
                    .attr("x", function (d) { return x(d.WR) - size / 2; } )
                    .attr("y", function (d) { return y(d.Games) - size / 2; } )
                    .attr("width", size)
                    .attr("height", size)
                    .style("stroke", this.colours[champClass])
            }else{
                d3.select("#ChampScatter")
                    .selectAll(`.${champClass}`)
                    .selectAll("circle").transition()
                    .duration(200)
                    .style("opacity", 1)
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
        renderData(champData){
            let size = 25
            let x = this.x
            let y = this.y

            let groups = d3.select("#ChampScatter").select(`.dataWrapper`)
                .selectAll("dot")
                .data(champData)
                .enter()
                .append('g')
                .attr("class", function (d) {return Champions.ClassesfromID(d.Name)[0]; })         

            groups.append('image')
                .attr("x", function (d) { return x(d.WR) - size / 2; } )
                .attr("y", function (d) { return y(d.Games) - size / 2; } )
                .attr("width", size)
                .attr("height", size)
                .style("display", "none")
                .attr("href", function (d) {return Champions.iconPathFromID(d.Name)})
                // .attr("class", function (d) {return Champions.ClassesfromID(d.Name)[0]; })         
                .on("mouseover", this.mouseover )
                .on("mousemove", this.mousemove )
                .on("mouseleave", this.mouseleave )

            groups.append('rect')
                .attr("x", function (d) { return x(d.WR) - size / 2 + 1; } )
                .attr("y", function (d) { return  y(d.Games) - size / 2 + 1; } )
                // .attr("class", function (d) { return Champions.ClassesfromID(d.Name)[0]; })
                .attr("width", size - 2)
                .attr("height", size - 2)
                .style("display", "none")
                .style("fill", "none")
                .style("stroke", "black")
                .style("stroke-width", "2px")

            groups.append("circle")
                .attr("cx", function (d) { return x(d.WR); } )
                .attr("cy", function (d) { return y(d.Games); } )
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

    
        var tooltip = d3.select("#ChampScatter")
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
                .attr("transform",
                    "translate(" + this.margin.left + "," + this.margin.top + ")");
            // Add X axis

        var xAxis = svg.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(this.x));


            
        var yAxis = svg.append("g")
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
        d3.csv("http://localhost:5173/stats/wo_lanes/global_wbpr.csv").then((data) => {
            let total = data.reduce((accumulator, point) =>  {return Number(accumulator) + Number(point.Games)}, 0)
            data = data.filter((point) => {
                return point.Name != "None"
            })

            this.renderData(data)
            this.showAll()


            svg.append("line")
            .attr("x1", 0)  //<<== change your code here
            .attr("y1", this.y(total / data.length))
            .attr("x2", this.width)  //<<== and here
            .attr("y2", this.y(total / data.length))
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
                // hideClassBans(tag)
                this.visible[champClass] = false;

            }else{
                this.showClass(champClass)
                // showClassBans(champClass)
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
            console.log(hoveredClass)
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
            if(!this.visible[d3.select(event.target.parentNode).attr("class")]) return;

            d3.select("#ChampScatter").select(`.tooltip`)
                .html(`${Champions.nameFromID(d.Name)}<br>Games: ${d.Games}<br>WR: ${d.WR}% `)
                .style("left", (event.x) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", (event.y)+ "px")
                .style("display", "block")
        },
        mouseover(event, d) {
            let champClass = d3.select(event.target.parentNode).attr("class")
            if(!this.visible[champClass]) return;
            d3.select("#ChampScatter").select(`.tooltip`)
                .style("opacity", 1)            
                .html(`${Champions.nameFromID(d.Name)}<br>Games: ${d.Games}<br>WR: ${d.WR}%<br>`)
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