---
layout: code
title: Textures.js
image: logo.svg
categories: [ d3js ]
deps: [ 'https://d3js.org/d3.v3.min.js', 'https://cdn.rawgit.com/riccardoscalco/textures/master/textures.min.js' ]
---
<style>
    svg{
        background: #fff;
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
        
        var l = textures.lines()
            .id( 'pattern' )
            .heavier( 10 )
            .thinner( 1.5 );

        svg.call( l );

        svg.append( 'circle' )
            .attr( 'cx', 500 )
            .attr( 'cy', 150 )
            .attr( 'r', 100 )
            .style( 'fill', l.url() );

        var t = textures.paths()
            .d( function( s ) {
                return 'M 0,' + s*3/4 + ' l ' +
                    s/2 + ',' + -s/2 + ' l ' +
                    s/2 + ',' + s/2;
            } )
            .size( 20 )
            .strokeWidth( 1 )
            .thicker( 2 )
            .stroke( 'darkorange' );

        svg.call( t );

        svg.append( 'circle' )
            .attr( 'cx', 600 )
            .attr( 'cy', 150 )
            .attr( 'r', 100 )
            .style( 'fill', t.url() );
    } );
</script>