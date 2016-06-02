---
layout: code
title: FlowField and Particle System with PVectorjs
image: Particle-System-with-PVectorjs.png
categories: [ js, canvas, pvectorjs ]
deps: [ 'https://cdn.rawgit.com/MAKIO135/pvectorjs/master/build/pvector.min.js', 'https://cdn.rawgit.com/jwagner/simplex-noise.js/master/simplex-noise.min.js' ]
---
<canvas id="cnvs"></canvas>

<script>
    window.addEventListener('load', function(){
        var canvas = document.getElementById('cnvs'),
            context = canvas.getContext('2d'),
            width = window.innerWidth < 1200 ? window.innerWidth : 1200,
            height = 400;

        canvas.width = width;
        canvas.height = height;

        window.addEventListener('resize', function(){
            width = window.innerWidth < 1200 ? window.innerWidth : 1200;
            height = 400;
            canvas.width = width;
            canvas.height = height;
        });

        ///////////////////////////////////////////////
        function constrain(val,min,max){
            return val < min ? min : val > max ? max : val;
        }
        ///////////////////////////////////////////////

        var simplex,
            flowfield,
            particleSystem,
            frame;

        
        var Particle = function( x, y ) {
            this.life = 10 + Math.floor(Math.random()*500);
            this.loc = new PVector( x, y );
            this.prevLoc = this.loc.clone();
            this.vel = new PVector();
            this.acc = new PVector();
        };

        Particle.prototype.applyForce = function( force ) {
            this.acc.add( force );
        };

        Particle.prototype.update = function() {
            this.life --;
            this.vel.add( this.acc );
            if( this.vel.mag() > 8 ) this.vel.norm().mult( 8 );
            this.loc.add( this.vel );

            this.acc.mult( 0 );
        };

        Particle.prototype.warp = function() {
            if ( this.loc.x < 0 ) {
                this.loc.x = width;
                this.prevLoc = this.loc.clone();
            } else if ( this.loc.x > width ) {
                this.loc.x = 0;
                this.prevLoc = this.loc.clone();
            }

            if ( this.loc.y < 0 ) {
                this.loc.y = height;
                this.prevLoc = this.loc.clone();
            } else if ( this.loc.y > height ) {
                this.loc.y = 0;
                this.prevLoc = this.loc.clone();
            }
        };

        Particle.prototype.display = function() {
            context.beginPath();
            context.moveTo(this.prevLoc.x, this.prevLoc.y);
            context.lineTo(this.loc.x, this.loc.y );
            context.stroke();

            this.prevLoc = this.loc.clone();
        };

        Particle.prototype.isDead = function() {
            return ( this.life <= 0 );
        };

        var ParticleSystem = function ( nbParticles ) {
            this.particles = [];
            for ( var i = 0; i < nbParticles; i ++ ) {
                this.addParticle( Math.random() *  width, Math.random() *  height );
            }
        };

        ParticleSystem.prototype.addParticle = function( x, y ) {
            this.particles.push( new Particle( x, y ) );
        };

        ParticleSystem.prototype.run = function(field) {
            context.strokeStyle = 'rgba( 251, 53, 80, 0.2)';
            this.particles.forEach(function(p){
                p.applyForce( field.getForce( p.loc ) );
                p.update();
                p.warp();
                p.display();
            });
            
            var nDead = 0;
            for( var i=this.particles.length-1; i>=0; i--){
                if ( this.particles[i].isDead() ){
                    nDead ++;
                    this.particles.splice( i, 1 );
                }
            }

            for( var i=0; i<nDead; i++){
                this.addParticle( Math.random()*width, Math.random()*height );
            }
        };

        ParticleSystem.prototype.applyForce = function( force ) {
            this.particles.forEach(function(p){
                p.applyForce( force );
            });
        };
        

        var FlowField = function( _nx, _ny, _scale ) {
            this.nx = _nx;
            this.ny = _ny;
            this.scale = _scale;
            this.w = width / this.nx;
            this.h = height / this.ny;
            this.vecs = [];
            for(var i=0;i<this.nx;i++) this.vecs.push( (new Array(this.ny)).fill(0).map(function(){
                return new PVector(8,0);
            }) );
        };

        FlowField.prototype.update = function( time ) {
            for (var i = 0; i < this.nx; i++ ) {
                for (var j = 0; j < this.ny; j++ ) {
                    this.vecs[ i ][ j ].rotateTo( simplex.noise3D( i / this.scale, j / this.scale, time ) * 4 * Math.PI );
                }
            }
        };

        FlowField.prototype.getForce = function( v ) {
            return this.vecs[ ~~( constrain( v.x, 0, width - 1 ) / this.w ) ][ ~~( constrain( v.y, 0, height - 1 ) / this.h ) ];
        };

        function setup(){
            simplex = new SimplexNoise();
            flowfield = new FlowField(50,50,40);
            particleSystem = new ParticleSystem( 10000 );
            frame = 0;

            flowfield.update(frame);

            context.fillStyle = 'rgba( 30, 38, 48, 1 )';
            context.fillRect(0,0,width,height);

            animate();
        }

        function animate(){
            window.requestAnimationFrame(animate);
            
            context.fillStyle = 'rgba( 30, 38, 48, .1 )';
            context.fillRect(0,0,width,height);

            flowfield.update(frame/300);

            particleSystem.run(flowfield);

            frame++;
        }

        setup();
        window.addEventListener( 'resize', setup );
    });
</script>