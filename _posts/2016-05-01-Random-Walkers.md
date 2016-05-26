---
layout: code
title: Nature of Code - Introduction
image: NOC-intro.gif
categories: [ js, canvas ]
---
<style>
    canvas{
        background:#000;
    }
</style>

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
        var random = function(min, max){
            return min + Math.random()*(max-min);
        }
        ///////////////////////////////////////////////
        
        function RandomWalker(x,y){
            this.x = x;
            this.y = y;
        }

        RandomWalker.prototype.update = function(){
            this.x += Math.round(random(-1,1));
            this.y += Math.round(random(-1,1));
        };

        RandomWalker.prototype.checkBoundaries = function(){
            if(this.x<0) this.x = width;
            else if(this.x>width) this.x = 0;

            if(this.y<0) this.y = height;
            else if(this.y>height) this.y = 0;
        };

        RandomWalker.prototype.display = function(){
            context.fillRect(this.x, this.y, 1, 1);
        };

        var w;
        function setup(){
            w = (new Array(500)).fill(0).map(function(){
                return new RandomWalker(width/2, height/2);
            });

            animate();
        }

        function animate(){
            window.requestAnimationFrame(animate);
            context.fillStyle = 'rgba(0,0,0,0.02)';
            context.fillRect(0,0,width,height);

            context.fillStyle = '#fff';
            w.forEach(function(d){
                d.update();
                d.checkBoundaries();
                d.display();
            });
        }

        setup();
    });
</script>