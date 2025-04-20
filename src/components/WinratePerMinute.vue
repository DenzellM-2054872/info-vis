<template>
    <div ref="chartContainer" class="chart-container"></div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import * as d3 from 'd3';
  
  interface DataItem {
    key: string;
    value: number;
  }
  
  export default defineComponent({
    setup() {
      const chartContainer = ref<HTMLElement | null>(null);
  
      // Sample dictionary (convert to array for D3)
      const dataDict = {
        "0.0": 0.484375,
            "2.5": 0.75,
            "5.0": 0.4166666666666667,
            "7.5": 0.25,
            "10.0": 0.4,
            "12.5": 0.3333333333333333,
            "15.0": 0.4276729559748428,
            "17.5": 0.4666666666666667,
            "20.0": 0.5111111111111111,
            "22.5": 0.509090909090909,
            "25.0": 0.4830188679245283,
            "27.5": 0.5111607142857143,
            "30.0": 0.4528735632183908,
            "32.5": 0.4625,
            "35.0": 0.46551724137931033,
            "37.5": 0.489010989010989,
            "40.0": 0.5793650793650794,
            "42.5": 0.5377358490566038,
            "45.0": 0.6206896551724138,
            "47.5": 0.5882352941176471,
            "50.0": 0.3333333333333333,
            "52.5": 0.375,
            "55.0": 0.5,
            "57.5": 0.25
      };
  
      // Convert dictionary to array of objects
      const data: DataItem[] = Object.entries(dataDict).map(([key, value]) => ({
        key,
        value,
      }));
  
      onMounted(() => {
        drawChart();
      });
  
      function drawChart() {
        if (!chartContainer.value) return;
  
        // Clear previous SVG (if any)
        d3.select(chartContainer.value).selectAll('*').remove();
  
        // Set up dimensions
        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  
        // Create SVG
        const svg = d3
          .select(chartContainer.value)
          .append('svg')
          .attr('width', width)
          .attr('height', height);
  
        // X-axis: Band scale for keys
        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d.key))
            .range([margin.left, width - margin.right])
            .padding(0.1);
        

        // Y-axis: Linear scale for values
        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.value)!])
            .range([height - margin.bottom, margin.top]); // Inverted range
  
        // Draw bars
        svg
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d) => xScale(d.key)!)
        .attr('y', yScale(0)) // Start from the bottom (yScale(0))
        .attr('width', xScale.bandwidth())
        .attr('height', 0) // Initial height = 0 (for animation)
        .attr('fill', 'steelblue')
        .transition()
        .duration(1000)
        .attr('y', (d) => yScale(d.value))
        .attr('height', (d) => yScale(0) - yScale(d.value));
  
        // Add axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);
  
        svg
          .append('g')
          .attr('transform', `translate(0, ${height - margin.bottom})`)
          .call(xAxis);
  
        svg
          .append('g')
          .attr('transform', `translate(${margin.left}, 0)`)
          .call(yAxis);
      }
  
      return { chartContainer };
    },
  });
  </script>
  
  <style scoped>
  .chart-container {
    margin: 20px;
  }
  </style>