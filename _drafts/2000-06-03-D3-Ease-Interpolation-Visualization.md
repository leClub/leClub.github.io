---
layout: code
title: D3 Ease and Interpolation Visualization
image: D3-Ease-Interpolation-Visualization.PNG
categories: [ d3js ]
deps: [ 'https://d3js.org/d3.v3.min.js' ]
---
<p>
    <a href="http://bl.ocks.org/mbostock/248bac3b8e354a9103c4">http://bl.ocks.org/mbostock/248bac3b8e354a9103c4</a> <br>
    <a href="https://github.com/d3/d3-ease">https://github.com/d3/d3-ease</a>
</p>
<div id='render'></div>

<script>
    window.addEventListener( 'load', function() {
        var h = 450, w;
        var svg = d3.select( '#render' )
            .append( 'svg' );

        function getWidth(){
            w = window.innerWidth > 1200 ? 1200 : window.innerWidth;
            svg.attr( { width: w, height: h } )
        }
        getWidth();
        window.addEventListener( 'resize', getWidth );

        var data = [ 'linear', 'quad', 'cubic', 'sin', 'exp', 'circle', 'elastic', 'back', 'bounce' ].map( function( d ){
            return { ease: d };
        } );

        svg.selectAll( 'text' )
            .data( data )
            .enter()
            .append( 'text' )
            .attr( {
                x: 10,
                fill: '#FB3550'
            } )
            .attr( 'y', function( d, i ){
                return 30 + i * 50;
            } )
            .text( function( d ){ return d.ease; } );

        svg.selectAll( 'rect' )
            .data( data )
            .enter()
            .append( 'rect' )
            .attr( {
                x: 0,
                width: w,
                height: 50,
                fill: '#FB3550'
            } )
            .attr( 'y', function( d, i ){
                return i * 50;
            } )
            .attr( 'opacity', function( d, i ){
                return 0.2 + ( i % 2 ) * 0.2;
            } )
            .text( function( d ){ return d.ease; } );

        var circles = svg.selectAll( 'circle' )
            .data( data )
            .enter()
            .append( 'circle' )
            .attr( {
                cx: 100,
                r: 10,
                fill: '#FB3550'
            } )
            .attr( 'id', function( d, i ){
                return 'c' + i;
            } )
            .attr( 'cy', function( d, i ){
                return 25 + i * 50;
            } );

            function anim(){
                data.forEach( function( d, i ){
                    svg.select( '#c' + i )
                        .attr( 'cx', 100 )
                        .transition()
                        .duration( 2000 )
                        .ease( d.ease )
                        .attr( 'cx', w - 200 );
                } );
            }

            anim();

            svg.node().addEventListener( 'click', function(){
                anim();
            } );
    });
</script>