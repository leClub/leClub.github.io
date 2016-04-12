---
layout: code
title: d3 boilerplate
image: logo.svg
categories: [ d3js ]
deps: [ 'https://d3js.org/d3.v4.0.0-alpha.28.min.js' ]
---
<style>
    svg{
        background: #fff;
    }
</style>

<div id="render"></div>

<script>
    window.addEventListener('load', function(){
        var svg = d3.select('#render')
            .append('svg')
            .attr('width',1200)
            .attr('height',300);

        svg.append('rect')
            .attr('x', 100)
            .attr('y', 100)
            .attr('width', 100)
            .attr('height', 100)
            .attr('fill', '#f00');
    });
</script>