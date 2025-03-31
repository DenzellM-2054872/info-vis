
<template>
    <div id="BannedScatter"></div>
</template>
<script  lang="js">
import * as d3 from "d3" ;
import { Rainbow } from '@indot/rainbowvis';
import Champions from "@/classes/Champion.ts";
let totalBans = 1;
let rb = new Rainbow()
let ban_data = []
let visData = []

let visible = {
    "Controller": true,
    "Fighter": true,
    "Mage": true,
    "Marksman": true,
    "Tank": true,
    "Specialist": true,
    "Slayer": true,
}

export function colourData(){
    d3.select("#BannedScatter")
        .selectAll("circle")
        .attr("r", 5)
        .style("fill", function (d) { return `#${rb.colourAt(d.Bans)}`; } )
        .style("opacity", 1)
        .style("stroke", "gray")

}

export function lowLightClassBans(champClass){
    d3.select("#BannedScatter")
    .selectAll(`.${champClass}`)
    .filter("circle").transition()
    .duration(200)
    .style("fill", "lightgrey")
    .style("opacity", 0.33)
    .style("display", "block")
    .attr("r", 4)
}

export function lowLightAllBans(){
    d3.select("#BannedScatter")
    .selectAll("circle")
    .transition()
    .duration(200)
    .style("fill", "lightgrey")
    .style("opacity", 0.33)
    .attr("r", 4)
}

export function highlightClassBans(champClass){
    d3.select("#BannedScatter")
        .selectAll(`.${champClass}`)
        .filter("circle").transition()
        .duration(200)
        .style("opacity", 1)
        .attr("r", 6)
        .style("fill", function (d) { return `#${rb.colourAt(d.Bans)}`; } )
}

export function hideClassBans(champClass){
    visible[champClass] = false

    visData = ban_data.filter((d) => visible[Champions.ClassesfromID(d.Name)[0]])
    let maxBans = visData.reduce((accumulator, point) =>  {return Math.max(Number(accumulator), Number(point.Bans))}, 0)
    let minBans = visData.reduce((accumulator, point) =>  {return Math.min(Number(accumulator), Number(point.Bans))}, Infinity)
    console.log(`${minBans} - ${maxBans}`)
    rb.setNumberRange(minBans, maxBans)

    d3.select("#BannedScatter")
        .selectAll(`.${champClass}`)
        .filter("circle").transition()
        .duration(200)
        .attr("r", 5)
        .style("display", "none")

    for(let cls in visible){
        if(visible[cls]){
            showClassBans(cls)
        }
    }
}

export function showClassBans(champClass){
    visible[champClass] = true

    visData = ban_data.filter((d) => visible[Champions.ClassesfromID(d.Name)[0]])
    let maxBans = visData.reduce((accumulator, point) =>  {return Math.max(Number(accumulator), Number(point.Bans))}, 0)
    let minBans = visData.reduce((accumulator, point) =>  {return Math.min(Number(accumulator), Number(point.Bans))}, Infinity)
    console.log(`${minBans} - ${maxBans}`)
    rb = new Rainbow().setNumberRange(minBans, maxBans)
    rb.setSpectrum('#ffffff', '#ff0000', '000000')


    d3.select("#BannedScatter")
        .selectAll(`.${champClass}`)
        .filter("circle").transition()
        .duration(200)
        .attr("r", 5)
        .style("opacity", 1)
        .style("display", "block")
        .style("fill", function (d) { return `#${rb.colourAt(d.Bans)}`; } )
}

function mousemove(event, d) {
    d3.select("#BannedScatter").selectAll(`.tooltip`)
        .style("opacity", 1)            
        .html(`${Champions.nameFromID(d.Name)}<br>Bans: ${d.Bans}<br>BR: ${Math.floor(d.Bans / totalBans * 10000)/100}%<br>`)
        .style("left", (event.x) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", (event.y)+ "px")
        .style("display", "block")
}

function mouseover(event, d) {
    d3.select("#BannedScatter").selectAll(`.tooltip`)
        .style("opacity", 1)            
        .html(`${Champions.nameFromID(d.Name)}<br>Bans: ${d.Bans}<br>BR: ${Math.floor(d.Bans / totalBans * 10000)/100}%<br>`)
        .style("left", (event.x) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", (event.y)+ "px")
        .style("display", "block")
            
        lowLightAllBans()
            
        d3.select(this).transition()
        .duration(200)
        .attr("r", 6)
}

function mouseleave(event, d) {
    d3.select("#BannedScatter").select(`.tooltip`)
        .transition()
        .style("opacity", 0)
        .style("display", "none")

    colourData()

}   
export default{
    name: "BannedScatter",
    methods: {
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
    

        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#BannedScatter")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
            // Add X axis
        var x = d3.scaleLinear()
            .domain([43, 57])
            .range([ 0, width ]);

        var xAxis = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 150000])
            .range([ height, 0]);
        var yAxis = svg.append("g")
            .call(d3.axisLeft(y));

 
        var scatter = svg.append('g')
            .attr("clip-path", "url(#clip)")  
        //Read the data
        d3.csv("http://localhost:5173/stats/wo_lanes/global_wbpr.csv").then((data) => {
            data = data.filter((point) => {
                return point.Name != "None"
            })
            ban_data = data
            visData = data
            let totalGames = data.reduce((accumulator, point) =>  {return Number(accumulator) + Number(point.Games)}, 0)
            let maxBans = data.reduce((accumulator, point) =>  {return Math.max(Number(accumulator), Number(point.Bans))}, 0)
            let minBans = data.reduce((accumulator, point) =>  {return Math.min(Number(accumulator), Number(point.Bans))}, Infinity)

            totalBans = data.reduce((accumulator, point) => {return Number(accumulator) + Number(point.Bans)}, 0)
            let test = data.reduce((accumulator, point) => {return Number(accumulator) + Number(point.Bans) / totalBans}, 0)

            rb.setNumberRange(minBans, maxBans)
            rb.setSpectrum('#ffffff', '#ff0000', '000000')

            scatter
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", function (d) { return Champions.ClassesfromID(d.Name)[0]; })
            .attr("cx", function (d) { return x(d.WR); } )
            .attr("cy", function (d) { return y(d.Games); } )
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)


            colourData()

            svg.append("line")
            .attr("x1", 0)  //<<== change your code here
            .attr("y1", y(totalGames / data.length))
            .attr("x2", width)  //<<== and here
            .attr("y2",  y(totalGames / data.length))
            .style("stroke-width", 2)
            .style("stroke", "gray")
            .style("fill", "none")
            .style("stroke-dasharray", "4");

        })
        

        svg.append("line")
            .attr("x1", x(50))  //<<== change your code here
            .attr("y1", 0)
            .attr("x2", x(50))  //<<== and here
            .attr("y2", height)
            .style("stroke-width", 2)
            .style("stroke", "gray")
            .style("fill", "none")
            .style("stroke-dasharray", "4");

        }
    },
    mounted(){
        this.createSVG()
    }
}


</script>



<style lang="scss" scoped>

</style>