---
layout: code
title: processingjs boilerplate
image: ProcessingJS-Boilerplate.PNG
categories: [ processingjs ]
deps: [ 'https://rawgit.com/processing-js/processing-js/v1.4.8/processing.min.js' ]
---
<canvas id="render"></canvas>

<script type="text/processing" data-processing-target="render">
    // documentation: <a href="http://processingjs.org/reference/">http://processingjs.org/reference/</a>

    int w = window.innerWidth < 1200 ? window.innerWidth : 1200, 
        h = 600;

    color darkblue = color( 30, 38, 48 );
    color electricred = color( 251, 53, 80 );

    void setup() {
        size( w, h );
        background( darkblue );
        noStroke();
    }

    void draw(){
        if( mousePressed ){
            fill( lerpColor( darkblue, electricred, constrain( random( -1, 2 ), 0, 1 ) ) );
            float radius = noise( frameCount / 20 ) * 200;
            ellipse( mouseX, mouseY, radius, radius );
        }
    }

    void keyPressed(){
        background( darkblue );
    }

    window.addEventListener( 'resize', function(){
        w = window.innerWidth < 1200 ? window.innerWidth : 1200;
        h = 600;

        setup();
    } );
</script>