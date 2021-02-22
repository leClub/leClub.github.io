---
layout: code
title: Text Animation with D3
image: D3-Text-Animation.PNG
categories: [ d3js ]
deps: [ 'https://d3js.org/d3.v3.min.js', 'https://cdn.jsdelivr.net/gh/riccardoscalco/textures/dist/textures.js' ]
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
            var mask, text;

            ( function(){
                mask = svg.append( 'clipPath' )
                    .attr( 'id', 'mask' );
                mask
                    .append( 'rect' )
                    .attr( {
                        id: 'rectmask',
                        x: 0,
                        y: 0,
                        width: 0,
                        height: h
                    } );

                var pattern = textures.lines()
                    .thinner()
                    .heavier()
                    .stroke( 'rgb( 251, 53, 80 )' )
                    .orientation( '' + ( ~~( 1 + Math.random() * 3 ) * 2 + ( Math.random() < .5 ? -1 : 1 ) ) + '/8' )
                    .id( 'pattern' );
            
                svg.call( pattern );

                text = svg.append( 'text' )
                    .attr( {
                        x: w/2,
                        'font-size': '250px',
                        fill: pattern.url(),
                        'clip-path': 'url(#mask)'
                    } )
                    .style( 'text-anchor', 'middle' )
                    .style( 'font-family', 'Raleway' )
                    .text( 'le Club'.toUpperCase() );

                text.attr( 'y', h / 2 );
                var bbox = text.node().getBBox();
                text.attr( 'y', h / 2  + h / 2 - ( bbox.y + bbox.height / 2 ) );

                step1();
            } )();

            function step1(){
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
                    .each( 'end', endStep );

                d3.select( '#pattern' )
                    .select( 'path' )
                    .attr( 'stroke-width', 4 )
                    .transition()
                    .delay( 1000 )
                    .duration( 500 )
                    .attr( 'stroke-width', 30 );
            }

            function endStep(){
                text.remove();
                mask.remove();
                d3.select( '#pattern' ).remove();
                svg.select( 'defs' ).remove();

                anim();
            }
        } )();
    } );
</script>
