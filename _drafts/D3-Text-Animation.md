---
layout: code
title: Text Animation with D3
image: logo.svg
categories: [ d3js ]
deps: [ 'https://d3js.org/d3.v3.min.js', 'https://cdn.rawgit.com/riccardoscalco/textures/master/textures.min.js' ]
---
<link href='https://fonts.googleapis.com/css?family=Raleway:900italic' rel='stylesheet' type='text/css'>
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

    svg text{
        font-family: Raleway, sans-serif;
    }
</style>

<div id='render'></div>

<script>
    // Textures.js: https://riccardoscalco.github.io/textures/

    window.addEventListener( 'load', function() {
        var h = 300, w;
        var svg = d3.select( '#render' )
            .append( 'svg' );

        function getWidth(){
            w = window.innerWidth > 1200 ? 1200 : window.innerWidth;
            svg.attr( { width: w, height: h } );
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

        svg.append( 'clipPath' )
            .attr( 'id', 'mask' )
            .append( 'rect' )
            .attr( {
                id: 'rectmask',
                x: 0,
                y: 0,
                width: w,
                height: h
            } );

        var t = textures.lines()
            .thinner()
            .heavier()
            .stroke( 'rgb( 251, 53, 80 )' )
            .id( 'pattern' );
    
        svg.call( t );

        var text = svg.append( 'text' )
            .attr( {
                x: w/2,
                'font-size': '250px',
                fill: t.url(),
                'clip-path': 'url(#mask)'
            } )
            .style( 'text-anchor', 'middle' )
            .text( 'le Club'.toUpperCase() );

        text.attr( 'y', h / 2 );
        var bbox = text.node().getBBox();
        text.attr( 'y', h / 2  + h / 2-( bbox.y + bbox.height / 2 ) );

        function title(){
            d3.select( '#rectmask' )
                .attr( {
                    width: 0,
                    height: h,
                    y: 0
                } )
                .transition()
                .duration( 500 )
                .attr( 'width', w )
                .transition()
                .duration( 800 )
                .transition()
                .duration( 500 )
                .attr( {
                    height: 0,
                    y: h / 2
                } )
                .each( 'end', bars );

            d3.select( '#pattern' )
                .select( 'path' )
                .attr( 'stroke-width', 4 )
                .transition()
                .delay( 1000 )
                .duration( 500 )
                .attr( 'stroke-width', 30 );
        }

        function bars(){
            var margin = 50;
            var space = 10;
            var barWidth = 30;

            var nb = Math.floor( ( w - margin * 2 ) / ( barWidth + space ) );
            margin = ( w - ( nb * ( barWidth + space ) ) ) / 2;

            var g = svg.append( 'g' )
                .attr( 'id', 'bars' );

            var data = d3.range( nb ).map( function( d ){
                var pos = Math.random() < .5 ? -1 : 1,
                    height = 20 + Math.floor( Math.random() * ( h / 2 - 20 - 20 ) ),
                    h1 =  5 + Math.random() * ( height / 2 - 10),
                    h2 =  5 + Math.random() * ( height / 2 - 10),
                    h3 = height - h1 - h2;

                return {
                    pos: pos,
                    height: height,
                    cumul: [ h1, h2, h3 ]
                };
            } );

            function createElements(){
                g.selectAll( 'rect' )
                    .remove()
                    .data( d3.range( nb * 3 ) )
                    .enter()
                    .append( 'rect' )
                    .datum( function( d, i ){
                        return {
                            pos: data[ ~~( i / 3 ) ].pos,
                            height: data[ ~~( i / 3 ) ].height
                        };
                    } );

                animateElements();
            }

            function animateElements(){
                var count = 0;

                g.selectAll( 'rect' )
                    .attr( {
                        fill: 'rgb( 251, 53, 80 )',
                        y: h / 2,
                        width: barWidth,
                        height: 0
                    } )
                    .attr( 'x', function( d, i ){
                        return margin + space / 2 + ( barWidth + space ) * ~~( i / 3 );
                    } )
                    .transition()
                    .delay( function( d, i ){
                        return ~~( i / 3 ) * 50;
                    } )
                    .attr( 'height', function( d ){
                        return Math.abs( d.height );
                    } )
                    .attr( 'y', function( d ){
                        return d.pos < 0 ? h / 2 - d.height : h / 2 ;
                    } )
                    .each( 'end', function(){
                        count ++;
                        if( count === nb *3 ) animateElements2();
                    } );
            }

            function animateElements2(){
                var count = 0;

                g.selectAll( 'rect' )
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
                    .attr( 'height', function( d, i ){
                        return data[ ~~( i / 3 ) ].cumul[ i % 3 ] - 1;
                    } )


                    .transition()
                    .attr( 'x', function( d, i ){
                        return margin + space / 2 + ( barWidth + space ) * ~~( i / 3 ) + ( i % 3) * 11;
                    } )
                    .attr( 'width', 8 )


                    .transition()
                    .attr( 'y', function( d, i ){
                        var y;
                        if(  d.pos < 0 ){
                            y = h / 2 - ( data[ ~~( i / 3 ) ].cumul[ i % 3 ] - 1 );
                        }
                        else{
                            y = h / 2;
                        }
                        return y;
                    } )


                    .transition()
                    .duration( 500 )
                    .attr( {
                        y: h / 2,
                        height: 0
                    } )
                    .remove()
                    .each( 'end', function(){
                        count ++;
                        if( count === nb *3 ) title();
                    } );
            }

            createElements();
        }

        window.addEventListener( 'click', title );
        title();
    } );
</script>