
<template>
    <div id="BannedScatter"></div>
</template>
<script  lang="js">
import * as d3 from "d3" ;
import { Rainbow } from '@indot/rainbowvis';
import Champions from "@/classes/Champion.ts";



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

            let totalGames = data.reduce((accumulator, point) =>  {return Number(accumulator) + Number(point.Games)}, 0)
            let maxBans = data.reduce((accumulator, point) =>  {return Math.max(Number(accumulator), Number(point.Bans))}, 0)
            let minBans = data.reduce((accumulator, point) =>  {return Math.min(Number(accumulator), Number(point.Bans))}, Infinity)

            let totalBans = data.reduce((accumulator, point) => {return Number(accumulator) + Number(point.Bans)}, 0)
            let test = data.reduce((accumulator, point) => {return Number(accumulator) + Number(point.Bans) / totalBans}, 0)
            console.log(test)
            let rb = new Rainbow().setNumberRange(0, 0.1)
            rb.setSpectrum('#ffffff', '#ff0000', '000000')

            console.log(maxBans)
            console.log(minBans)

            scatter
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.WR); } )
            .attr("cy", function (d) { return y(d.Games); } )
            .attr("r", 5)
            .style("fill", function (d) { return `#${rb.colourAt(d.Bans / totalBans)}`; } )
            // .style("fill", function (d) { return rb.colourAt(470656); } )
            .style("stroke", "gray")


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