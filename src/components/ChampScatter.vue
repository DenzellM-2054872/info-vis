
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
const legend_mouseover = function(event, d) {
    let unfiltered = true;
    for(let tag in visible){
        unfiltered = unfiltered && visible[tag];
    }
    if(!unfiltered) return;

    d3.selectAll("circle")
    .transition()
    .duration(200)
    .style("fill", "lightgrey")
    .style("opacity", 0.33)
    .attr("r", 4)

    d3.selectAll(`.${d3.select(this).attr('class')}`)
    .filter("circle").transition()
    .duration(200)
    .attr("r", 6)
    .style("opacity", 1)
    .style("fill", colours[d3.select(this).attr('class')])
}

const legend_click = function(event, d) {
    let unfiltered = true;
    for(let tag in visible){
        unfiltered = unfiltered && visible[tag];
    }

    if(unfiltered){
        d3.selectAll("circle")
        .transition()
        .duration(200)
        .style("opacity", 0)

        for(let tag in visible){
            visible[tag] = false;
        }
    }
    if(visible[d3.select(this).attr('class')]){
        d3.selectAll(`.${d3.select(this).attr('class')}`)
            .filter("circle").transition()
            .transition()
            .duration(200)
            .style("opacity", 0)
        visible[d3.select(this).attr('class')] = false
    }else{
        d3.selectAll(`.${d3.select(this).attr('class')}`)
            .filter("circle").transition()
            .duration(200)
            .attr("r", 6)
            .style("opacity", 1)
            .style("fill", colours[d3.select(this).attr('class')])
        visible[d3.select(this).attr('class')] = true
    }

}

const legend_mouseleave = function(event, d) {

    let unfiltered = true;
    for(let tag in visible){
        unfiltered = unfiltered && visible[tag];
    }
    if(!unfiltered) return;

    d3.selectAll(".Slayer")
        .filter("circle")
        .transition()
        .duration(200)
        .style("fill", "#e41a1c")
        .style("opacity", 1)
        .attr("r", 5)

    d3.selectAll(".Controller")
        .filter("circle")
        .transition()
        .duration(200)
        .style("fill", "#4daf4a")
        .style("opacity", 1)
        .attr("r", 5)

    d3.selectAll(".Fighter")
        .filter("circle")
        .transition()
        .duration(200)
        .style("fill", "#984ea3")
        .style("opacity", 1)
        .attr("r", 5)

    d3.selectAll(".Mage")
        .filter("circle")
        .transition()
        .duration(200)
        .style("fill", "#377eb8")
        .style("opacity", 1)
        .attr("r", 5)

    d3.selectAll(".Marksman")
        .filter("circle")
        .transition()
        .duration(200)
        .style("fill", "#ff7f00")
        .style("opacity", 1)
        .attr("r", 5)

    d3.selectAll(".Tank")
        .filter("circle")
        .transition()
        .duration(200)
        .style("fill", "#a65628")
        .style("opacity", 1)
        .attr("r", 5)

    d3.selectAll(".Specialist")
        .filter("circle")
        .transition()
        .duration(200)
        .style("fill", "#ffff33")
        .style("opacity", 1)
        .attr("r", 5)
}

export default{
    name: "ChampScatter",
    methods: {
        createSVG(){
        let tagCombos = {}
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

            d3.selectAll("circle")
            .transition()
            .duration(200)
            .style("fill", "lightgrey")
            .attr("r", 4)
            
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
        }
        
        // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
        const mouseleave = function(event, d) {
            if(!visible[d3.select(this).attr("class")]) return;
            tooltip
                .transition()
                .style("opacity", 0)

                d3.selectAll("circle")
                .transition()
                .duration(200)
                .style("fill", "#69b3a2")
                .attr("r", 5)

                d3.selectAll(".Slayer")
                .filter("circle")
                .transition()
                .duration(200)
                .style("fill", "#e41a1c")
                .attr("r", 5)

                d3.selectAll(".Controller")
                .transition()
                .duration(200)
                .style("fill", "#4daf4a")
                .attr("r", 5)

                d3.selectAll(".Fighter")
                .transition()
                .duration(200)
                .style("fill", "#984ea3")
                .attr("r", 5)

                d3.selectAll(".Mage")
                .selectAll("circle")
                .transition()
                .duration(200)
                .style("fill", "#377eb8")
                .attr("r", 5)

                d3.selectAll(".Marksman")
                .transition()
                .duration(200)
                .style("fill", "#ff7f00")
                .attr("r", 5)

                d3.selectAll(".Tank")
                .transition()
                .duration(200)
                .style("fill", "#a65628")
                .attr("r", 5)

                d3.selectAll(".Specialist")
                .transition()
                .duration(200)
                .style("fill", "#ffff33")
                .attr("r", 5)
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
        // Add one dot in the legend for each name.
        svg.append("rect").attr("x", 300).attr("y",30).attr("width", size).attr("class", "Controller").attr("height", size).style("fill", "#4daf4a").on("mouseover", legend_mouseover).on("mouseleave", legend_mouseleave).on("click", legend_click)
        svg.append("text").attr("x", 320).attr("y", 40).text("Controller").attr("class", "Controller").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "white").on("mouseover", legend_mouseover).on("mouseleave", legend_mouseleave).on("click", legend_click)

        svg.append("rect").attr("x", 300).attr("y", 50).attr("width", size).attr("class", "Fighter").attr("height", size).style("fill", "#984ea3").on("mouseover", legend_mouseover).on("mouseleave", legend_mouseleave).on("click", legend_click)
        svg.append("text").attr("x", 320).attr("y", 60).text("Fighter").attr("class", "Fighter").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "white").on("mouseover", legend_mouseover).on("mouseleave", legend_mouseleave).on("click", legend_click)

        svg.append("rect").attr("x", 300).attr("y", 70).attr("width", size).attr("class", "Mage").attr("height", size).style("fill", "#377eb8").on("mouseover", legend_mouseover).on("mouseleave", legend_mouseleave).on("click", legend_click)
        svg.append("text").attr("x", 320).attr("y", 80).text("Mage").attr("class", "Mage").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "white").on("mouseover", legend_mouseover).on("mouseleave", legend_mouseleave).on("click", legend_click)

        svg.append("rect").attr("x", 300).attr("y", 90).attr("width", size).attr("class", "Marksman").attr("height", size).style("fill", "#ff7f00").on("mouseover", legend_mouseover).on("mouseleave", legend_mouseleave).on("click", legend_click)
        svg.append("text").attr("x", 320).attr("y", 100).text("Marksman").attr("class", "Marksman").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "white").on("mouseover", legend_mouseover).on("mouseleave", legend_mouseleave).on("click", legend_click)

        svg.append("rect").attr("x", 300).attr("y", 110).attr("width", size).attr("class", "Slayer").attr("height", size).style("fill", "#e41a1c").on("mouseover", legend_mouseover).on("mouseleave", legend_mouseleave).on("click", legend_click)
        svg.append("text").attr("x", 320).attr("y", 120).text("Slayer").attr("class", "Slayer").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "white").on("mouseover", legend_mouseover).on("mouseleave", legend_mouseleave).on("click", legend_click)

        svg.append("rect").attr("x", 300).attr("y", 130).attr("width", size).attr("class", "Specialist").attr("height", size).style("fill", "#ffff33").on("mouseover", legend_mouseover).on("mouseleave", legend_mouseleave).on("click", legend_click)
        svg.append("text").attr("x", 320).attr("y", 140).text("Specialist").attr("class", "Specialist").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "white").on("mouseover", legend_mouseover).on("mouseleave", legend_mouseleave).on("click", legend_click)

        svg.append("rect").attr("x", 300).attr("y", 150).attr("width", size).attr("class", "Tank").attr("height", size).style("fill", "#a65628").on("mouseover", legend_mouseover).on("mouseleave", legend_mouseleave).on("click", legend_click)
        svg.append("text").attr("x", 320).attr("y", 160).text("Tank").attr("class", "Tank").style("font-size", "15px").attr("alignment-baseline","middle").style("fill", "white").on("mouseover", legend_mouseover).on("mouseleave", legend_mouseleave).on("click", legend_click)

        //  // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
        //  var zoom = d3.zoom()
        //     .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
        //     .extent([[x(0), y(0)], [width, height]])
        //     .on("zoom", updateChart);

        // svg.append("rect")  
        //     .attr("width", width )
        //     .attr("height", height )
        //     .style("fill", "none")
        //     .style("pointer-events", "all")
        //     // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        //     .call(zoom);

        var scatter = svg.append('g')
            .attr("clip-path", "url(#clip)")  
        //Read the data
        d3.csv("http://localhost:5173/stats/wo_lanes/global_wbpr.csv").then((data) => {
            data = data.filter((point) => {
                return point.Name != "None"
            })
            console.log(data)
            // Add dots
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
            .attr("class", function (d) { return Champions.ClassesfromCodeName(d.Name)[0]; })
            .on("mouseover", mouseover )
            .on("mousemove", mousemove )
            .on("mouseleave", mouseleave )

            d3.selectAll(".Slayer")
            .transition()
            .duration(200)
            .style("fill", "#e41a1c")
            .attr("r", 5)

            d3.selectAll(".Controller")
            .transition()
            .duration(200)
            .style("fill", "#4daf4a")
            .attr("r", 5)

            d3.selectAll(".Fighter")
            .transition()
            .duration(200)
            .style("fill", "#984ea3")
            .attr("r", 5)

            d3.selectAll(".Mage")
            .transition()
            .duration(200)
            .style("fill", "#377eb8")
            .attr("r", 5)

            d3.selectAll(".Marksman")
            .transition()
            .duration(200)
            .style("fill", "#ff7f00")
            .attr("r", 5)

            d3.selectAll(".Tank")
            .transition()
            .duration(200)
            .style("fill", "#a65628")
            .attr("r", 5)

            d3.selectAll(".Specialist")
            .transition()
            .duration(200)
            .style("fill", "#ffff33")
            .attr("r", 5)

        })
        

        let middle = svg.append("line")
            .attr("x1", x(50))  //<<== change your code here
            .attr("y1", 0)
            .attr("x2", x(50))  //<<== and here
            .attr("y2", height)
            .style("stroke-width", 2)
            .style("stroke", "gray")
            .style("fill", "none")
            .style("stroke-dasharray", "4");

        // A function that updates the chart when the user zoom and thus new boundaries are available
        function updateChart(event) {
            // recover the new scale
            var newX = event.transform.rescaleX(x);
            var newY = event.transform.rescaleY(y);

            // update axes with these new boundaries
            xAxis.call(d3.axisBottom(newX))
            yAxis.call(d3.axisLeft(newY))
      
            middle
            .attr("x1", newX(50))
            .attr("x2", newX(50))
            // update circle position
            scatter
            .selectAll("circle")
            .attr('cx', function(d) {return newX(d.WR)})
            .attr('cy', function(d) {return newY(d.Games)})
            .on("mouseover", mouseover )
            .on("mousemove", mousemove )
            .on("mouseleave", mouseleave );
        }



        // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom


        console.log(tagCombos)
        }
    },
    mounted(){
        this.createSVG()
    }
}


</script>



<style lang="scss" scoped>

</style>