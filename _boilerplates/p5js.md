---
layout: code
title: p5js boilerplate
image:
categories: [ p5js ]
deps: [ 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.4.23/p5.js' ]
---
<div id="render"></div>

<script>
    var canvas;
    var darkblue, electricred;

    function setup(){
        canvas = createCanvas( 1200, 600 );
        canvas.parent( '#render' );
        noStroke();

        darkblue = color( 30, 38, 48 ); 
        electricred = color( 251, 53, 80 );
    }

    function draw () {
        background( darkblue );

        for ( var i = 0; i < 10; i++ ) {
            fill( 251, 53, 80, 255 / 10 * ( i + 1 ) );
            rect( width / 10 * i, 0, width / 10, height );
        }

        fill( electricred );
        ellipse( mouseX, mouseY, 200, 200 );
    }

    function windowResized() {
        resizeCanvas( window.innerWidth < 1200 ? window.innerWidth : 1200, 600 );
    }
</script>