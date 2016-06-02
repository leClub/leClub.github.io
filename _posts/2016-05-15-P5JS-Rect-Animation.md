---
layout: code
title: Rect Animation With P5js
image: Rect-Animation.PNG
categories: [ p5js ]
deps: [ 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.4.23/p5.js' ]
---
<div id="render"></div>

<script>
    //documentation: <a href="http://p5js.org/reference/">http://p5js.org/reference/</a>

    window.addEventListener('load', function(){
        var sketch = function (p) {
            var nb, x, vx, y, vy, w, h, c1, c2;

            var margin = 50,
                minNb = 5,
                maxNb = 25,
                maxSpeed = 30;

            var first = true;

            p.setup = function(){
                p.createCanvas( window.innerWidth < 1200 ? window.innerWidth : 1200, 600 );
                initVal();
                p.noStroke();
            }

            p.draw = function(){
                p.background( c1 );

                for( var i=0; i<nb; i++ ){
                    p.fill( p.lerpColor( c1, c2, i / nb ) );
                    p.rect(
                        ~~ p.map( i, 0, nb, 0, x ),
                        ~~ p.map( i, 0, nb, 0, y ),
                        ~~ p.map( i, 0, nb, p.width, w ),
                        ~~ p.map( i, 0, nb, p.height, h )
                    );
                }
                updatePos();

                if( p.frameCount % 200 === 0 ) initVal();
            }

            function initVal(){
                nb = ~~ p.random( minNb, maxNb );
                x = p.floor( p.random( margin, p.width-margin ) );
                vx = p.random( -maxSpeed, maxSpeed);
                y = p.floor( p.random( margin, p.height-margin ) );
                vy = p.random( -maxSpeed, maxSpeed);
                w = p.floor( p.random( p.width - x ) );
                h = p.floor( p.random( p.height - y ) );

                if( first ){
                    first = false;
                    c1 = p.color( 251, 53, 80 );
                    c2 = p.color( 30, 38, 48 );
                    p.frameCount = 100;
                }
                else{
                    c1 = p.color( ~~ p.random(255), ~~ p.random(255), ~~ p.random(255) );
                    c2 = p.color( ~~ p.random(255), ~~ p.random(255), ~~ p.random(255) );
                }
            }

            function updatePos(){
                x += vx;
                y += vy;
                if( x < 0 ){
                    x = 0;
                    vx *= -1;
                }
                else if( x + w > p.width ){
                    x = p.width - w;
                    vx *= -1;
                }

                if( y < 0 ){
                    y = 0;
                    vy *= -1;
                }
                else if( y + h > p.height ){
                    y = p.height - h;
                    vy *= -1;
                }
            }

            p.mousePressed = function(){
                first = true;
                initVal();
            }

            p.windowResized = function() {
                p.resizeCanvas( window.innerWidth < 1200 ? window.innerWidth : 1200, 600 );
            }
        };

        new p5( sketch, document.getElementById( 'render' ) );
    });
</script>