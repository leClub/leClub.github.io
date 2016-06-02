---
layout: code
title: Pyramid Chart Animation with D3
image: D3-Pyramid-Graph.PNG
categories: [ big, d3js ]
deps: [ 'https://d3js.org/d3.v3.min.js' ]
---
<style>
    svg{
        border: solid 1px rgb( 251, 53, 80 );
    }

    svg:hover{
        cursor: pointer;
    }    

    svg #border{
        fill: none;
        stroke: rgb( 251, 53, 80 );
        stroke-width: 1px;
        transition: all .1s ease-in;
    }

    svg:hover #border{
        cursor: pointer;
        stroke-width: 20px;
    }
</style>

<div id='render'></div>

<script>
    window.addEventListener( 'load', function() {
        var h = 500, w;
        var svg = d3.select( '#render' )
            .append( 'svg' );

        function getWidth(){
            w = window.innerWidth > 1200 ? 1200 : window.innerWidth;
            svg.attr( { width: w, height: h } );
            d3.select( '#border' ).attr( 'width', w );
        }
        getWidth();
        window.addEventListener( 'resize', getWidth );
        
        svg.append( 'rect' )
            .attr( {
                id: 'border',
                x: 0,
                y: 0,
                width: w,
                height: h
            } );

        function anim1(){
            var data, g, bars;

            ( function(){
                var n = 10;
                var data2 = d3.shuffle( d3.range( n ) );
                var data3 = d3.shuffle( d3.range( n )  );
                data = d3.range( n ).map( function( d ){
                    return {
                        pos1: d,
                        pos2: data2[ d ],
                        pos3: data3[ d ],
                    }
                } );

                g = svg.append( 'g' );
                bars = g.selectAll( 'rect' )
                    .data( data )
                    .enter()
                    .append( 'rect' )
                    .attr( {
                        x: w / 2,
                        width: 0,
                        height: 0,
                        fill: 'rgb( 251, 53, 80 )',
                        opacity: 0
                    } )
                    .attr( 'y', function( d ){
                        return 50 + ~~( ( h - 100 ) / data.length ) * d.pos1;
                    } );

                step1();
            } )();

            function step1(){
                var count = 0;

                bars
                    .transition()
                    .duration( 500 )
                    .delay( function( d, i ){
                        return ( data.length - i ) * 100;
                    } )
                    .attr( 'width', function( d ){
                        return ( d.pos3 + 1 ) / data.length * ( w - 100 );
                    } )
                    .attr( 'height', ~~( ( h - 100 ) / data.length ) )
                    .attr( 'x', function( d ){
                        return w / 2 - ( ( d.pos3 + 1 ) / data.length * ( w - 100 ) )/2;
                    } )
                    .attr( 'opacity', function( d ){
                        return ( 1 / data.length ) * ( d.pos3 + 1 );
                    } )
                    .transition()
                    .duration( 300 )
                    .each( 'end', function(){
                        count ++;
                        if( count === data.length ) step2();
                    } );
            }

            function step2(){
                var count = 0;

                bars
                    .transition()
                    .duration( 500 )
                    .attr( 'width', function( d ){
                        return ( d.pos2 + 1 ) / data.length * ( w - 100 );
                    } )
                    .attr( 'x', function( d ){
                        return w / 2 - ( ( d.pos2 + 1 ) / data.length * ( w - 100 ) )/2;
                    } )
                    .attr( 'opacity', function( d ){
                        return ( 1 / data.length ) * ( d.pos2 + 1 );
                    } )
                    .transition()
                    .duration( 300 )

                    .transition()
                    .duration( 500 )
                    .attr( 'width', function( d ){
                        return ( d.pos1 + 1 ) / data.length * ( w - 100 );
                    } )
                    .attr( 'x', function( d ){
                        return w / 2 - ( ( d.pos1 + 1 ) / data.length * ( w - 100 ) )/2;
                    } )
                    .attr( 'opacity', function( d ){
                        return ( 1 / data.length ) * ( d.pos1 + 1 );
                    } )
                    .transition()
                    .duration( 300 )

                    .transition()
                    .duration( 500 )
                    .attr( 'width', w - 100 )
                    .attr( 'x', 50 )
                    .attr( 'opacity', function( d ){
                        return ( 1 / data.length ) * ( d.pos1 + 1 );
                    } )
                    .each( 'end', function(){
                        count ++;
                        if( count === data.length ) endStep();
                    } );
            }

            function endStep(){
                bars.remove();
                g.remove();
                anim2( data );
            }
        }

        function anim2( _data ){
            var data, paths;

            ( function(){
                data = _data;

                paths = svg.selectAll( 'path' )
                    .data( data )
                    .enter()
                    .append( 'path' )
                    .attr( {
                        stroke: 'rgb( 251, 53, 80 )',
                        fill: 'none',
                        'stroke-width': ~~( ( h - 100 ) / data.length )
                    } )
                    .attr( 'opacity', function( d ){
                        return ( 1 / data.length ) * ( d.pos1 + 1 );
                    } )
                    .attr( 'd', function( d ){
                        var path =
                            ' M ' + ~~( w - 50 ) +              ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos1 + 0.5 ) ) +
                            ' L ' + ~~( 5 / 6 * ( w - 100) ) +  ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos1 + 0.5 ) ) +
                            ' L ' + ~~( 4 / 6 * ( w - 100) ) +  ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos1 + 0.5 ) ) +
                            ' L ' + ~~( w / 2 + 15 ) +          ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos1 + 0.5 ) ) +
                            ' L ' + ~~( w / 2 - 15 ) +          ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos1 + 0.5 ) ) +
                            ' L ' + ~~( 2 / 6 * ( w - 100) ) +  ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos1 + 0.5 ) ) +
                            ' L ' + ~~( 1 / 6 * ( w - 100) ) +  ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos1 + 0.5 ) ) +
                            ' L ' + 50 +                        ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos1 + 0.5 ) );
                        return path;
                    } );

                step1();
            } )();

            function step1(){
                paths
                    .transition()
                    .duration( 500 )
                    .attr( 'd', function( d ){
                        var path =
                            ' M ' + ~~( w - 50 ) +              ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos1 + 0.5 ) ) +
                            ' L ' + ~~( 5 / 6 * ( w - 100) ) +  ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos1 + 0.5 ) ) +
                            ' L ' + ~~( 4 / 6 * ( w - 100) ) +  ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos2 + 0.5 ) ) +
                            ' L ' + ~~( w / 2 + 15 ) +          ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos2 + 0.5 ) ) +
                            ' L ' + ~~( w / 2 - 15 ) +          ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos2 + 0.5 ) ) +
                            ' L ' + ~~( 2 / 6 * ( w - 100) ) +  ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos2 + 0.5 ) ) +
                            ' L ' + ~~( 1 / 6 * ( w - 100) ) +  ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos1 + 0.5 ) ) +
                            ' L ' + 50 +                        ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos1 + 0.5 ) );
                        return path;
                    } )
                    .transition()
                    .duration( 500 )
                    .attr( 'd', function( d ){
                        var path =
                            ' M ' + ~~( w - 50 ) +              ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos3 + 0.5 ) ) +
                            ' L ' + ~~( 5 / 6 * ( w - 100) ) +  ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos3 + 0.5 ) ) +
                            ' L ' + ~~( 4 / 6 * ( w - 100) ) +  ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos2 + 0.5 ) ) +
                            ' L ' + ~~( w / 2 + 15 ) +          ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos2 + 0.5 ) ) +
                            ' L ' + ~~( w / 2 - 15 ) +          ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos2 + 0.5 ) ) +
                            ' L ' + ~~( 2 / 6 * ( w - 100) ) +  ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos2 + 0.5 ) ) +
                            ' L ' + ~~( 1 / 6 * ( w - 100) ) +  ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos1 + 0.5 ) ) +
                            ' L ' + 50 +                        ' ' + ( 50 + ~~( ( h - 100 ) / data.length ) * ( d.pos1 + 0.5 ) );
                        return path;
                    } )
                    .transition()
                    .duration( 300 )
                    .each( 'end', step2 );
            }

            function step2(){
                var count = 0;

                paths
                    .transition()
                    .duration( 500 )
                    .attr( 'stroke-width', 3 )
                    .transition()
                    .duration( 300 )
                    .each( 'end', function( d, i ){
                        count ++;
                        if( count === data.length ) step3();
                    } );
            }

            function step3(){
                var count = 0;

                svg.selectAll( 'path' )
                    .datum( function( d ){
                        return {
                            length: this.getTotalLength()
                        };
                    } )
                    .attr( 'stroke-dasharray', function( d ){
                        return ( d.length / 10 ) + ' ' + 0;
                    } )
                    .transition()
                    .delay( function( d, i ){
                        return i * 50;
                    } )
                    .duration( 1000 )
                    .attr( 'stroke-dasharray', function( d ){
                        return 0 + ' ' + ( d.length / 10 );
                    } )
                    .each( 'end', function(){
                        count ++;
                        if( count == data.length ) endStep();
                    } );
            }

            function endStep(){
                paths.remove();

                anim1();
            }
        }
        anim1();
    } );
</script>