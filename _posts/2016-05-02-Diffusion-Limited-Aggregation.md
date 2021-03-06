---
layout: code
title: Diffusion Limited Aggregation
image: DLA.png
categories: [ js, canvas ]
---
<canvas id="cnvs"></canvas>

<script>
    window.addEventListener( 'load', function(){
        var canvas = document.getElementById( 'cnvs' ),
            context = canvas.getContext( '2d' ),
            width = window.innerWidth < 1200 ? window.innerWidth : 1200,
            height = 400;

        canvas.width = width;
        canvas.height = height;

        window.addEventListener( 'resize', function(){
            width = window.innerWidth < 1200 ? window.innerWidth : 1200;
            height = 400;
            canvas.width = width;
            canvas.height = height;
        } );

        ///////////////////////////////////////////////
        var random = function( min, max ){
            return min + Math.random() * ( max - min );
        }
        ///////////////////////////////////////////////
        
        function RandomWalker( x, y ){
            this.x = x;
            this.y = y;
        }

        RandomWalker.prototype.update = function( xoffset, yoffset ){
            this.x += xoffset;
            this.y += yoffset;
        };

        RandomWalker.prototype.checkBoundaries = function(){
            if( this.x < 0 ) this.x = width;
            else if( this.x > width ) this.x = 0;

            if( this.y < 0 ) this.y = height;
            else if( this.y > height ) this.y = 0;
        };

        RandomWalker.prototype.display = function(){
            context.fillRect( this.x, this.y, 1, 1 );
        };

        function checkDLA( x, y ){
            return dla[ x + y * width ];
        }

        var walkers, dla, count;
        function setup(){
            count = 0;
            dla = new Array( width * height ).fill( false );
            var angle = Math.PI * 2 / 360;
            for(var i = 0; i < 360; i++ ){
                var x = ~~( width / 2 + Math.cos( angle * i ) * height / 3 ),
                    y = ~~( height / 2 + Math.sin( angle * i ) * height / 3 );
                dla[ x + y * width ] = true;
            }
            for( var i = 0; i < 360; i++ ){
                var x = ~~( width / 2 + Math.cos( angle * i ) * ( width / 2 - 100 ) ),
                    y = ~~( height / 2 + Math.sin( angle * i ) * ( width / 2 - 100 ) );
                if( x >= 0 && x < width && y >= 0 && y < height ) dla[ x + y*width ] = true;
            }

            walkers = ( new Array( 100000 ) ).fill( 0 ).map( function(){
                return new RandomWalker( ~~( Math.random() * width ), ~~( Math.random() * height ) );
            } );

            context.fillStyle = '#1E2630';
            context.fillRect( 0, 0, width, height );
            animate();
        }

        function animate(){
            window.requestAnimationFrame( animate );
            walkers.forEach( function( d, i ){
                var xoffset = Math.round( random( -1, 1 ) ),
                    yoffset = Math.round( random( -1, 1 ) );
                
                if( checkDLA( d.x + xoffset, d.y + yoffset) ){
                    context.fillStyle = 'rgb(251, 53, 80)';
                    count++;
                    d.display();
                    dla[ d.x + d.y * width ] = true;
                    walkers.splice( i, 1 );
                }
                else{
                    d.update( xoffset, yoffset );
                    d.checkBoundaries();
                }
            } );
        }

        setup();

        window.addEventListener( 'resize', function(){
            setup();
        } );
    } );
</script>