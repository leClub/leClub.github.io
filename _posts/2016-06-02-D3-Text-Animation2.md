---
layout: code
title: Gooey Text with D3 #2
image: D3-Gooey.PNG
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

    canvas{
        display: none;
    }
</style>

<canvas id='cnvs'></canvas>
  
<svg></svg>

<script>
    window.addEventListener( 'load', function() {
        var h = 500, w;
        var svg = d3.select( 'svg' );

        function getWidth(){
            w = window.innerWidth > 1200 ? 1200 : window.innerWidth;
            svg.attr( { width: w, height: h } );
            d3.select( '#border' ).attr( 'width', w );
            cnvs.width = w;
            cnvs.height = h;
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
            var cnvs, ctx;
            var g, defs, rad, circles;
            var title = [ 'le Club', 'Learn.', 'Code.', 'Create.' ];
            var frame = 0, speed = 500, n = 2500;
            var color = d3.rgb( '#FB3550' );

            ( function(){
                cnvs = document.querySelector( '#cnvs' );
                ctx = cnvs.getContext( '2d' );
                cnvs.width = w;
                cnvs.height = h;

                goo = svg.append( 'g' )
                    .style( 'filter', 'url(#gooey)' );
                
                defs = svg.append( 'defs' );
                var filter = defs.append( 'filter' ).attr( 'id', 'gooey' )
                filter.append( 'feGaussianBlur' )
                    .attr( 'in', 'SourceGraphic' )
                    .attr( 'stdDeviation', '6' )
                    .attr( 'result', 'blur' );
                filter.append( 'feColorMatrix' )
                    .attr( 'in', 'blur' )
                    .attr( 'mode', 'matrix' )
                    .attr( 'values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 17 -7' )
                    .attr( 'result', 'gooey' );
                filter.append( 'feComposite' )
                    .attr( 'in', 'SourceGraphic' )
                    .attr( 'in2', 'gooey' )
                    .attr( 'operator', 'atop' );


                rad = d3.scale.linear()
                    .domain( [ 0, 1 ] )
                    .range( [ w / 3 - 20, w / 3 + 20 ] );

                circles = goo
                    .selectAll( 'circle' )
                    .data( d3.range( n ) )
                    .enter()
                    .append( 'circle' )
                    .attr( 'fill', '#000' )
                    .attr( 'cx', function( d ){ 
                        return ~~( Math.random() * w );
                    } )
                    .attr( 'cy', function( d ){ 
                        return ~~( Math.random() * h );
                    } )
                    .attr( 'r', 0 )
                    .attr( 'fill', color );

                step1();
            } )();

            function step1(){
                ctx.fillStyle = 'white';
                ctx.fillRect( 0, 0, cnvs.width, cnvs.height );
                ctx.font = '350px Raleway';
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText( title[ frame % title.length ], cnvs.width / 2, cnvs.height / 2 );
                cnvsData = ctx.getImageData( 0, 0, w, h ).data;
                frame++;
  
                var count = 0;
                circles
                    .datum( function(){
                        var r = ~~( 2 + Math.random() * 10 ),
                            x = ~~( Math.random() * w ),
                            y = ~~( Math.random() * h ),
                            duration = speed + ~~( Math.random() * 1000 );
                        
                        while( cnvsData[ ( x + y * w ) * 4 ] > 10 ){
                            x = ~~( Math.random() * w );
                            y = ~~( Math.random() * h );
                        }
                        return { x: x, y: y, r: r, duration: duration };
                    } )
                    .transition()
                    .duration( function( d ){
                        return d.duration;
                    } )
                    .delay( function( d, i ){
                        return i;
                    } )
                    .attr( 'fill', function(){
                        return  color.darker( Math.random() * 0.2 );
                    } )
                    .attr( 'cx', function( d ){
                        return d.x;
                    } )
                    .attr( 'cy', function( d ){
                        return d.y;
                    } )
                    .attr( 'r', function( d ){
                        return d.r;
                    } )
                    .each( 'end', function( d ){
                        count++;
                        if( count === n ){
                            step1();
                        }
                    } );
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