---
layout: code
title: Gray Scott Reaction Diffusion
image:
categories: [ p5js ]
deps: [ 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.4.23/p5.js' ]
---
<div id="render"></div>

<script>
    // Based on Daniel Shiffman's Coding Challenge: Reaction Diffusion Algorithm in p5.js
    // https://www.youtube.com/watch?v=BV9ny785UNc&index=3&list=WL

    var canvas;
    var darkblue, electricred;

    var grid, next;

    var dA = 1;
    var dB = 0.5;
    var feed = 0.055;
    var k = 0.062;
    var dt = 1;

    var convMatrix = [
        [ 0.05, 0.2, 0.05 ],
        [ 0.2, -1, 0.2 ],
        [ 0.05, 0.2, 0.05 ]
    ];

    function setup(){
        canvas = createCanvas( 200, 200 );
        canvas.parent( '#render' );
        noStroke();

        darkblue = color( 30, 38, 48 ); 
        electricred = color( 251, 53, 80 );

        initGrids();
    }

    function initGrids(){
        grid = [];
        next = [];
        for( var x = 0; x < width; x ++ ) {
            grid[ x ] = [];
            next[ x ] = [];
            for( var y = 0; y < height; y ++ ) {
                grid[ x ][ y ] = { a: 1, b: 0 };
                next[ x ][ y ] = { a: 1, b: 0 };
            }
        }

        for( var i = 95; i < 105; i ++ ) {
            for( var j = 95; j < 105; j ++ ) {
                grid[ i ][ j ].b = 1;
            }
        }
    }

    function draw () {
        background( darkblue );

        console.time("computeNext");
        for( var x = 1; x < width - 1; x ++ ) {
            for( var y = 1; y < height - 1; y ++ ) {
                var a = grid[ x ][ y ].a;
                var b = grid[ x ][ y ].b;

                next[ x ][ y ].a = a +
                    ( dA * laplace( 'a', x, y ) ) -
                    ( a * b * b ) +
                    ( feed * ( 1 - a ) );

                next[ x ][ y ].b = b +
                    ( dB * laplace( 'b', x, y ) ) +
                    ( a * b * b ) -
                    ( ( k + feed ) * b );

                next[ x ][ y ].a = constrain( next[ x ][ y ].a, 0, 1 );
                next[ x ][ y ].b = constrain( next[ x ][ y ].b, 0, 1 );
            }
        }

        loadPixels();
        for( var x = 0; x < width; x ++ ) {
            for( var y = 0; y < height; y ++ ) {
                var pix = ( x + y * width ) * 4;
                var a = next[ x ][ y ].a;
                var b = next[ x ][ y ].b;
                var c = floor( ( a - b ) * 255 );
                c = constrain( c, 0, 255 );
                pixels[ pix + 0 ] = floor( a * 255 );
                pixels[ pix + 1 ] = 0;
                pixels[ pix + 2 ] = floor( b * 255 );
                pixels[ pix + 3 ] = 255;
            }
        }
        updatePixels();

        swap();
    }

    function laplace( param, x, y ) {
        var sum = 0;
        for( var i = -1; i <= 1; i ++ ){
            for( var j = -1; j <= 1; j ++ ){
                sum += grid[ x + i ][ y + j ][ param ] * convMatrix[ i + 1 ][ j + 1 ];
            }
        }
        return sum;
    }

    function swap() {
        var temp = grid;
        grid = next;
        next = temp;
    }

    function windowResized() {
        resizeCanvas( window.innerWidth < 1200 ? window.innerWidth : 1200, 600 );
        init();
    }
</script>