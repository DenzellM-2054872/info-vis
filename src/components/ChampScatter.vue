
<template>
    <div id="ChampScatter"></div>
</template>
<script  lang="js">
import * as d3 from "d3" ;
import Champions from "@/classes/Champion.ts";
let colours = {
    "Controller": "#4daf4a",
    "Fighter": "#984ea3",
    "Mage": "#377eb8",
    "Marksman": "#ff7f00",
    "Tank": "#a65628",
    "Specialist": "#ffff33",
    "Slayer": "#e41a1c",
}

let visible = {
    "Controller": true,
    "Fighter": true,
    "Mage": true,
    "Marksman": true,
    "Tank": true,
    "Specialist": true,
    "Slayer": true,
}

function lowLightAll(){
    d3.selectAll("circle")
    .transition()
    .duration(200)
    .style("fill", "lightgrey")
    .style("opacity", 0.33)
    .attr("r", 4)
}

function highlightClass(champClass){
    d3.selectAll(`.${champClass}`)
    .filter("circle").transition()
    .duration(200)
    .style("opacity", 1)
    .attr("r", 6)
    .style("fill", colours[champClass])
}

function hideClass(champClass){
    d3.selectAll(`.${champClass}`)
        .filter("circle").transition()
        .duration(200)
        .attr("r", 5)
        .style("display", "none")
}

function showClass(champClass){
    d3.selectAll(`.${champClass}`)
        .filter("circle").transition()
        .duration(200)
        .attr("r", 5)
        .style("opacity", 1)
        .style("display", "block")
        .style("fill", colours[champClass])
}


function legend_mouseover(event, d) {
    let unfiltered = true;
    for(let tag in visible){
        unfiltered = unfiltered && visible[tag];
    }
    if(!unfiltered) return;

    lowLightAll()
    highlightClass(d3.select(this).attr('class'))
}

function legend_mouseleave(event, d) {

    let unfiltered = true;
    for(let tag in visible){
        unfiltered = unfiltered && visible[tag];
    }
    if(!unfiltered) return;

    for(let champClass in colours){
        showClass(champClass)
    }
}

function legend_click(event, d) {
    let unfiltered = true;
    for(let tag in visible){
        unfiltered = unfiltered && visible[tag];
    }

    if(unfiltered){
        for(let tag in visible){
            hideClass(tag)
            visible[tag] = false;
        }
    }
    let champClass = d3.select(this).attr('class')

    if(visible[champClass]){
        hideClass(champClass)
        visible[champClass] = false

    }else{
        showClass(champClass)
        visible[champClass] = true
    }

}

function generateTooltip(svg, yValue, size, champClass){
    svg.append("rect").attr("x", 300).attr("y", yValue).attr("width", size).attr("class", champClass).attr("height", size).style("fill", colours[champClass])
    .on("mouseover", legend_mouseover).on("mouseleave", legend_mouseleave).on("click", legend_click)

    svg.append("text").attr("x", 320).attr("y", yValue + 10).text(champClass).attr("class", champClass).style("font-size", "15px").attr("alignment-baseline","middle").style("fill", colours[champClass])
    .on("mouseover", legend_mouseover).on("mouseleave", legend_mouseleave).on("click", legend_click)

}



export default{
    name: "ChampScatter",
    methods: {
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


        // A function that change this tooltip when the user hover a point.
        // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
        const mouseover = function(event, d) {
            if(!visible[d3.select(this).attr("class")]) return;
            tooltip
            .style("opacity", 1)            
            .html(`${Champions.NamefromCodeName(d.Name)}<br>Games: ${d.Games}<br>WR: ${d.WR}%<br>`)
            .style("left", (event.x) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (event.y)+ "px")
            .style("display", "block")
            
            lowLightAll()
            
            d3.select(this).transition()
            .duration(200)
            .attr("r", 6)
        }

        const mousemove = function(event, d) {
            if(!visible[d3.select(this).attr("class")]) return;

            tooltip
                .html(`${Champions.NamefromCodeName(d.Name)}<br>Games: ${d.Games}<br>WR: ${d.WR}% `)
                .style("left", (event.x) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", (event.y)+ "px")
                .style("display", "block")
        }
        
        // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
        const mouseleave = function(event, d) {
            if(!visible[d3.select(this).attr("class")]) return;

            tooltip.transition()
                .style("opacity", 0)
                .style("display", "none")

            for(let champClass in colours){
                showClass(champClass)
            }
  
        }       

        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#ChampScatter")
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

        var size = 10
        let yValue = 30
        for(let champClass in colours){
            generateTooltip(svg, yValue, size, champClass)
            yValue += 20
        }
 
        var scatter = svg.append('g')
            .attr("clip-path", "url(#clip)")  
        //Read the data
        d3.csv("http://localhost:5173/stats/wo_lanes/global_wbpr.csv").then((data) => {
            
            let total = data.reduce((accumulator, point) =>  {return Number(accumulator) + Number(point.Games)}, 0)

            data = data.filter((point) => {
                return point.Name != "None"
            })

            scatter
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.WR); } )
            .attr("cy", function (d) { return y(d.Games); } )
            .attr("r", 5)
            .style("fill", "#69b3a2")
            .style("stroke", "black")
            .attr("class", function (d) { return Champions.ClassesfromID(d.Name)[0]; })
            .on("mouseover", mouseover )
            .on("mousemove", mousemove )
            .on("mouseleave", mouseleave )

            for(let champClass in colours){
                showClass(champClass)
            }

            svg.append("line")
            .attr("x1", 0)  //<<== change your code here
            .attr("y1", y(total / data.length))
            .attr("x2", width)  //<<== and here
            .attr("y2",  y(total / data.length))
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