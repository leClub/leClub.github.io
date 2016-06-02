---
layout: code
title: Stacked Bar Graph Animation with D3
image: D3-Stack-Bar-Graph.PNG
categories: [ d3js ]
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

        ( function anim(){
            var margin, space, barWidth, rects, nb, g, data;

            ( function(){
                margin = 50;
                space = 10;
                barWidth = 30;

                nb = Math.floor( ( w - margin * 2 ) / ( barWidth + space ) );
                margin = ( w - ( nb * ( barWidth + space ) ) ) / 2;

                g = svg.append( 'g' )
                    .attr( 'id', 'bars' );

                data = d3.range( nb ).map( function( d ){
                    var pos = Math.random() < .5 ? -1 : 1,
                        height = 20 + Math.random() * ( h / 2 - 20 - 20 ),
                        h1 =  5 + Math.random() * ( height / 2 - 10),
                        h2 =  5 + Math.random() * ( height / 2 - 10),
                        h3 = height - h1 - h2;

                    return {
                        pos: pos,
                        height: height,
                        cumul: [ h1, h2, h3 ]
                    };
                } );

                rects = g.selectAll( 'rect' )
                    .remove()
                    .data( d3.range( nb * 3 ) )
                    .enter()
                    .append( 'rect' )
                    .datum( function( d, i ){
                        var opacity = 1.0;
                        if( data[ ~~( i / 3 ) ].pos < 0 ){
                            if( i % 3 === 1 ){
                                opacity = .6;
                            }
                            else if( i % 3 === 2 ){
                                opacity = .3;
                            }
                        }
                        else{
                            if( i % 3 === 1 ){
                                opacity = .6;
                            }
                            else if( i % 3 === 0 ){
                                opacity = .3;
                            }
                        }
                        return {
                            opacity: opacity,
                            pos: data[ ~~( i / 3 ) ].pos,
                            height: data[ ~~( i / 3 ) ].height
                        };
                    } );

                step1();
            } )();

            // small bars graph
            function step1(){
                var count = 0;

                rects
                    .attr( {
                        opacity: 1.0,
                        fill: 'rgb( 251, 53, 80 )',
                        y: h / 2,
                        width: 8,
                        height: 0
                    } )
                    .attr( 'x', function( d, i ){
                        return margin + space / 2 + ( barWidth + space ) * ~~( i / 3 ) + ( i % 3) * 11;
                    } )
                    .transition()
                    .delay( function( d, i ){
                        return i * 10;
                    } )
                    .attr( 'height', function( d, i ){
                        return data[ ~~( i / 3 ) ].cumul[ i % 3 ];
                    } )
                    .attr( 'y', function( d, i ){
                        return d.pos < 0 ? h / 2 - ( data[ ~~( i / 3 ) ].cumul[ i % 3 ] ) : h / 2 ;
                    } )
                    .transition()
                    .duration( 300 )
                    .each( 'end', function(){
                        count ++;
                        if( count === nb *3 ) step2();
                    } );
            }

            // stack bars
            function step2(){
                var count = 0;

                rects
                    .transition()
                    .attr( 'y', function( d, i ){
                        var y;
                        if(  d.pos < 0 ){
                            y = h / 2 - d.height;
                        }
                        else{
                            y = h / 2;
                        }
                        for( var n = 0; n < i % 3; n++ ){
                            y += data[ ~~( i / 3 ) ].cumul[ n ];
                        }
                        return y;
                    } )
                    .transition()
                    .attr( 'x', function( d, i ){
                        return margin + space / 2 + ( barWidth + space ) * ~~( i / 3 );
                    } )
                    .attr( 'opacity', function( d ){
                        return d.opacity;
                    } )
                    .attr( 'width', barWidth )
                    .transition()
                    .duration( 300 )
                    .each( 'end', function(){
                        count ++;
                        if( count === nb *3 ) step3();
                    } )
            }

            // large bars graph
            function step3(){
                var count = 0;

                rects
                    .transition()
                    .duration( 300 )
                    .attr( 'height', function( d, i ){
                        var _h = 0;
                        if( d.pos < 0 ){
                            if( i % 3 === 0 ){
                                _h = Math.abs( d.height );
                            }
                        }
                        else{
                            if( i % 3 === 2 ){
                                _h = Math.abs( d.height );
                            }
                        }

                        return _h;
                    } )
                    .attr( 'y', function( d, i ){
                        var _y = h / 2;
                        if( d.pos < 0 ){
                            if( i % 3 === 0 ){
                                _y = h / 2 - d.height;
                            }
                        }
                        return _y ;
                    } )
                    .each( 'end', function(){
                        count ++;
                        if( count === nb *3 ) step4();
                    } );
            }

            function step4(){
                var last = 0, count = 0;

                var sortedHeights = data.map( function( d ){
                    return d.height * d.pos;
                } ).sort( function( a, b ){
                    return -( a - b );
                } );

                rects
                    .datum( function( d, i ){
                        var index = sortedHeights.indexOf( d.height * d.pos );
                        if( index == last ){
                            index++;
                        }
                        last = index;
                        return {
                            orderedIndex: index 
                        }
                    } )
                    .transition()
                    .duration( 500 )
                    .attr( 'x', function( d ){
                        return margin + space / 2 + ( barWidth + space ) * d.orderedIndex;
                    } )
                    .transition()
                    .duration( 300 )
                    .each( 'end', function(){
                        count ++;
                        if( count === data.length ) step5();
                    } );
            }

            // disapperaing large bars
            function step5(){
                var count = 0;

                rects
                    .transition()
                    .duration( 300 )
                    .attr( {
                        y: h / 2,
                        height: 0
                    } )
                    .each( 'end', function(){
                        count ++;
                        if( count === nb *3 ) endStep();
                    } );
            }

            function endStep(){
                rects.remove();
                g.remove();

                anim();
            }
        } )();
    } );
</script>