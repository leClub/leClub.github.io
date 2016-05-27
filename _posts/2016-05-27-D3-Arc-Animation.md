---
layout: code
title: Arc Animation with D3
image: D3-Arc-Animation.png
categories: [ big, js, d3 ]
deps: [ 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js' ]
---
<style>
    svg{
        width: 100%;
        height: 800px;
    }
</style>
<svg id="svg"></svg>

<script>
    window.addEventListener('load', function(){
        var svg = d3.select('svg');
        var w = parseInt(svg.style('width')),
            h = 800;
        console.log( w,h );
    
    var arc = d3.svg.arc()
        .innerRadius(function(d){return d.inner;})
        .outerRadius(function(d){return d.inner + d.outer;})
        .startAngle(3*Math.PI/2);
    
    var paths = svg.selectAll('path')
        .data( d3.range(15).map(function(m,i){
            return {
                endAngle:3*Math.PI/2,
                newAngle:3*Math.PI/2 + Math.PI + Math.random() * Math.PI,
                inner: 50+i*25,
                outer:20
            };
        }))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr('fill', 'white')
        .attr('transform', 'translate('+(w/2)+','+(h/2)+')');
    
    function arcTween(transition) {
        transition.attrTween("d", function(d) {
            var interpolate = d3.interpolate(d.endAngle, d.newAngle);
            return function(t) {
                d.endAngle = interpolate(t);
                return arc(d);
            };
        });
    }

    function anim(){
        paths
            .data( d3.range(15).map(function(m,i){
                return {
                    endAngle:3*Math.PI/2,
                    newAngle:3*Math.PI/2 + Math.PI + Math.random() * Math.PI,
                    inner: 50+i*25,
                    outer:20
                };
            }))
            .transition()
            //   .duration(function(d,i){return (i+1)*200;})
            .duration(function(d){return d.newAngle*50;})
            .ease('out')
            .delay(function(d,i){return i*20;})
            .call(arcTween);
        }
        anim();

        document.body.addEventListener('click', anim);
    });
</script>