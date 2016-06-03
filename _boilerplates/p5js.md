---
layout: code
title: p5js boilerplate
image:
categories: [ p5js ]
deps: [ 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.4.23/p5.js' ]
---
<div id="render"></div>

<script>
    //documentation: <a href="http://p5js.org/reference/">http://p5js.org/reference/</a>

    window.addEventListener( 'load', function(){
        var sketch = function ( p ) {
            var darkblue; 
            var electricred;

            p.setup = function () {
                p.createCanvas( 1200, 600 );
                p.noStroke();

                darkblue = p.color( 30, 38, 48 ); 
                electricred = p.color( 251, 53, 80 );
            };

            p.draw = function () {
                p.background( darkblue );

                for ( var i = 0; i < 10; i++ ) {
                    p.fill( 251, 53, 80, 255 / 10 * ( i + 1 ) );
                    p.rect( p.width / 10 * i, 0, p.width / 10, p.height );
                }

                p.fill( electricred );
                p.ellipse( p.mouseX, p.mouseY, 200, 200 );
            };

            p.windowResized = function() {
                p.resizeCanvas( window.innerWidth < 1200 ? window.innerWidth : 1200, 600 );
            }
        };

        new p5( sketch, document.getElementById( 'render' ) );
    });
</script>