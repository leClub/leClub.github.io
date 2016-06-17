---
layout: code
title: Lissajous Curves With P5js
image: Lissajous-curves.png
categories: [ p5js ]
deps: [ 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.4.23/p5.js', 'https://cdn.rawgit.com/dataarts/dat.gui/master/build/dat.gui.min.js' ]
---
<style>
    #container{
        position: relative;
    }
    .dg{
        position: absolute;
        top: 0;
        right: 0;
    }
</style>

<div id="container"></div>

<script>
    window.addEventListener('load', function(){
        var container = document.getElementById( 'container' ),
            sketch, canvas, gui;
        var params = {
            a: Math.random() * 2,
            b: Math.random() * 2,
            n: 15
        };

        sketch = function( p ) {
            p.setup = function(){
                canvas = p.createCanvas( window.innerWidth < 1200 ? window.innerWidth : 1200, 600 );
                p.background( 30, 38, 48 );
                p.stroke( 251, 53, 80 );

                gui = new dat.GUI( { autoPlace: false } );

                var aSlider = gui.add( params, 'a', 0, 2 ).step( 0.01 );
                aSlider.onChange( function(){
                    p.background( 30, 38, 48 );
                } );

                var bSlider = gui.add( params, 'b', 0, 2 ).step( 0.01 );
                bSlider.onChange( function(){
                    p.background( 30, 38, 48 );
                } );

                var nSlider = gui.add( params, 'n', 1, 30 ).step( 1 );
                nSlider.onChange( function(){
                    p.background( 30, 38, 48 );
                } );

                // p5js' mousePressed function applies EventListener to the container not to the canvas
                // so when clicking on the gui within the same container mousePressed event are called
                // and that is not desired
                canvas.elt.addEventListener( 'click', function( event ){
                    if( event.button === 0 ){ // check for left button
                        p.background( 30, 38, 48 );
                        params.a = Math.random() * 2;
                        params.b = Math.random() * 2;
                        for( var i in gui.__controllers ) {
                            gui.__controllers[ i ].updateDisplay();
                        }
                    }
                } );
            };

            p.draw = function(){
                for( var i = 0; i < params.n; i++ ){
                    var x = p.width / 2 + Math.cos( (i + p.frameCount * params.n ) / 200 * params.a ) * ( p.width / 2 - 10 );
                    var y = p.height / 2 + Math.sin( (i + p.frameCount * params.n ) / 200 * params.b ) * ( p.height / 2 - 10 );
                    p.point( x, y );
                }
            };

            p.windowResized = function() {
                p.resizeCanvas( window.innerWidth < 1200 ? window.innerWidth : 1200, 600 );
            };
        };
        new p5( sketch, container );

        container.appendChild( gui.domElement );
    });
</script>